// @ts-check
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const ORG = process.env.GITHUB_PROJECT_ORG || 'AV-EFI';
const PROJECT_NUMBER = Number(process.env.GITHUB_PROJECT_NUMBER || 1);
const OUT_DIR = path.resolve('docs/repo-analysis/github-issues-inventory');

const query = `
query($org: String!, $num: Int!, $cursor: String) {
  organization(login: $org) {
    projectV2(number: $num) {
      id
      title
      url
      items(first: 100, after: $cursor) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          type
          fieldValues(first: 50) {
            nodes {
              ... on ProjectV2ItemFieldTextValue {
                text
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldDateValue {
                date
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldMilestoneValue {
                milestone { title dueOn }
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldRepositoryValue {
                repository { nameWithOwner url }
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldLabelValue {
                labels(first: 30) { nodes { name color } }
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldUserValue {
                users(first: 30) { nodes { login name } }
                field { ... on ProjectV2FieldCommon { name } }
              }
            }
          }
          content {
            ... on Issue {
              number
              title
              url
              state
              createdAt
              updatedAt
              closedAt
              body
              repository { nameWithOwner url }
              labels(first: 30) { nodes { name color } }
              assignees(first: 20) { nodes { login name } }
              milestone { title dueOn }
            }
            ... on PullRequest {
              number
              title
              url
              state
              createdAt
              updatedAt
              closedAt
              repository { nameWithOwner url }
            }
            ... on DraftIssue {
              title
              body
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
}`;

function ghGraphql(variables) {
  const args = ['api', 'graphql', '-F', `query=${query}`];
  for (const [key, value] of Object.entries(variables)) {
    if (value !== null && value !== undefined) {
      args.push('-F', `${key}=${value}`);
    }
  }

  const stdout = execFileSync('gh', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'inherit'],
  });

  return JSON.parse(stdout);
}

function bodyInfo(body) {
  const text = typeof body === 'string' ? body : '';
  return {
    bodyHash: text ? createHash('sha256').update(text).digest('hex') : '',
    bodyExcerpt: text.replace(/\s+/g, ' ').trim().slice(0, 500),
  };
}

function fieldValuesToObject(fieldValues) {
  const out = {};
  for (const value of fieldValues?.nodes || []) {
    const fieldName = value?.field?.name;
    if (!fieldName) continue;

    if ('text' in value) out[fieldName] = value.text || '';
    else if ('name' in value) out[fieldName] = value.name || '';
    else if ('date' in value) out[fieldName] = value.date || '';
    else if ('milestone' in value) out[fieldName] = value.milestone?.title || '';
    else if ('repository' in value) out[fieldName] = value.repository?.nameWithOwner || '';
    else if ('labels' in value) out[fieldName] = (value.labels?.nodes || []).map((label) => label.name);
    else if ('users' in value) out[fieldName] = (value.users?.nodes || []).map((user) => user.login);
  }
  return out;
}

function flattenItem(item, project) {
  const content = item.content || {};
  const fields = fieldValuesToObject(item.fieldValues);
  const labels = (content.labels?.nodes || []).map((label) => label.name);
  const assignees = (content.assignees?.nodes || []).map((user) => user.login);
  const repository = content.repository?.nameWithOwner || fields.Repository || '';
  const body = bodyInfo(content.body);

  return {
    projectItemId: item.id,
    projectTitle: project.title,
    projectUrl: project.url,
    projectNumber: PROJECT_NUMBER,
    projectStatus: fields.Status || '',
    projectFields: fields,
    contentType: item.type,
    repository,
    issueNumber: content.number || null,
    issueUrl: content.url || '',
    title: content.title || fields.Title || '',
    state: content.state || '',
    labels,
    assignees,
    milestone: content.milestone?.title || fields.Milestone || '',
    createdAt: content.createdAt || '',
    updatedAt: content.updatedAt || '',
    closedAt: content.closedAt || '',
    bodyHash: body.bodyHash,
    bodyExcerpt: body.bodyExcerpt,
  };
}

function csvEscape(value) {
  if (Array.isArray(value)) value = value.join('; ');
  if (value === null || value === undefined) value = '';
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows) {
  const headers = [
    'projectItemId',
    'contentType',
    'repository',
    'issueNumber',
    'title',
    'state',
    'projectStatus',
    'labels',
    'assignees',
    'milestone',
    'createdAt',
    'updatedAt',
    'closedAt',
    'issueUrl',
    'bodyHash',
    'bodyExcerpt',
  ];
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(','));
  }
  return `${lines.join('\n')}\n`;
}

function countBy(rows, getter) {
  const counts = new Map();
  for (const row of rows) {
    const key = getter(row) || '(missing)';
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function markdownTable(entries, headers) {
  const lines = [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
  ];
  for (const entry of entries) {
    lines.push(`| ${entry.map((value) => String(value).replace(/\|/g, '\\|')).join(' | ')} |`);
  }
  return lines.join('\n');
}

function buildSummary(project, rows) {
  const issueRows = rows.filter((row) => row.contentType === 'ISSUE');
  const repoCounts = countBy(rows, (row) => row.repository);
  const stateCounts = countBy(rows, (row) => row.state);
  const statusCounts = countBy(rows, (row) => row.projectStatus);
  const typeCounts = countBy(rows, (row) => row.contentType);
  const missingAssignees = issueRows.filter((row) => row.assignees.length === 0).length;
  const missingLabels = issueRows.filter((row) => row.labels.length === 0).length;
  const missingMilestone = issueRows.filter((row) => !row.milestone).length;
  const missingStatus = rows.filter((row) => !row.projectStatus).length;
  const missingBody = issueRows.filter((row) => !row.bodyHash).length;

  const duplicateNumbers = countBy(
    issueRows.filter((row) => row.issueNumber),
    (row) => `${row.repository}#${row.issueNumber}`,
  ).filter(([, count]) => count > 1);

  return `# Project 1 Inventory Summary

Generated: ${new Date().toISOString()}

Project: [${project.title}](${project.url})

## Snapshot

- Project items reported by GitHub: ${project.totalCount}
- Project items exported: ${rows.length}
- Issue items exported: ${issueRows.length}
- Missing assignees: ${missingAssignees}
- Missing labels: ${missingLabels}
- Missing milestone: ${missingMilestone}
- Missing project status: ${missingStatus}
- Missing issue body: ${missingBody}
- Duplicate issue references in project snapshot: ${duplicateNumbers.length}

## Content Types

${markdownTable(typeCounts.map(([key, count]) => [key, count]), ['Type', 'Count'])}

## Issue States

${markdownTable(stateCounts.map(([key, count]) => [key, count]), ['State', 'Count'])}

## Project Statuses

${markdownTable(statusCounts.map(([key, count]) => [key, count]), ['Status', 'Count'])}

## Repositories

${markdownTable(repoCounts.map(([key, count]) => [key, count]), ['Repository', 'Count'])}

## Duplicate Issue References

${duplicateNumbers.length
    ? markdownTable(duplicateNumbers.map(([key, count]) => [key, count]), ['Issue', 'Count'])
    : 'No duplicate issue references found in this snapshot.'}

## Notes

- This is an inventory-only snapshot. No GitHub issues, labels, assignees, milestones, or project fields were changed.
- The next step is the reversible classification pass described in \`docs/repo-analysis/github-issues-consolidation-plan.md\`.
`;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const rows = [];
  let cursor = null;
  let projectInfo = null;

  do {
    const response = ghGraphql({ org: ORG, num: PROJECT_NUMBER, cursor });
    const project = response.data?.organization?.projectV2;
    if (!project) throw new Error(`Project ${ORG}/${PROJECT_NUMBER} was not found.`);
    projectInfo = {
      id: project.id,
      title: project.title,
      url: project.url,
      totalCount: project.items.totalCount,
    };
    rows.push(...project.items.nodes.map((item) => flattenItem(item, projectInfo)));
    cursor = project.items.pageInfo.hasNextPage ? project.items.pageInfo.endCursor : null;
  } while (cursor);

  const jsonPath = path.join(OUT_DIR, 'project-1-items.json');
  const csvPath = path.join(OUT_DIR, 'project-1-items.csv');
  const summaryPath = path.join(OUT_DIR, 'project-1-summary.md');

  fs.writeFileSync(jsonPath, `${JSON.stringify({ project: projectInfo, items: rows }, null, 2)}\n`);
  fs.writeFileSync(csvPath, toCsv(rows));
  fs.writeFileSync(summaryPath, buildSummary(projectInfo, rows));

  console.log(`Wrote ${path.relative(process.cwd(), jsonPath)}`);
  console.log(`Wrote ${path.relative(process.cwd(), csvPath)}`);
  console.log(`Wrote ${path.relative(process.cwd(), summaryPath)}`);
  console.log(`Exported ${rows.length} of ${projectInfo.totalCount} project items.`);
}

main();
