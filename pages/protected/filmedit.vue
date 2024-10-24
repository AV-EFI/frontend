<template>
  <div>
    <div class="container">
      <div class="breadcrumbs text-sm">
        <ul>
          <li><a href="/">Home</a></li>
          <li>
            <span class="text-accent">
              {{ $t('filmidentification') }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="container mb-4">
      <div class="overflow-x-auto">
        <table class="table table-zebra table-sm">
          <thead>
            <tr>
              <th>Konflikt-ID</th>
              <th>Dataset #1 PID</th>
              <th>Dataset #1 Titel</th>
              <th>Dataset #2 PID</th>
              <th>Dataset #2 Titel</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>tt0106936</td>
              <td>The Legend</td>
              <td>tt0062873</td>
              <td>The Young Girls of Rochefort</td>
              <td>
                <ShowDisambiguationComp
                  film-id_prev="tt0106936"
                  film-id_next="tt0062873"
                />
              </td>
            </tr>
            <tr>
              <th>2</th>
              <td>tt0286751</td>
              <td>Pulse</td>
              <td>tt0343221</td>
              <td>Mother of mine</td>
              <td>
                <ShowDisambiguationComp
                  film-id_prev="tt0286751"
                  film-id_next="tt0343221"
                />
              </td>
            </tr>
            <tr>
              <th>3</th>
              <td>tt0974014</td>
              <td>Creation</td>
              <td>tt0452624</td>
              <td>The Good German</td>
              <td>
                <ShowDisambiguationComp
                  film-id_prev="tt0974014"
                  film-id_next="tt0452624"
                />
              </td>
            </tr>
            <tr>
              <th>4</th>
              <td>tt0076984</td>
              <td>Battlestar Galactica</td>
              <td>tt0065377</td>
              <td>Airport</td>
              <td>
                <ShowDisambiguationComp
                  film-id_prev="tt0076984"
                  film-id_next="tt0065377"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>