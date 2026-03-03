import assert from "node:assert/strict";
import test from "node:test";

import { selectBestGndCandidate } from "../suggest-normdata-ids.js";

test("rejects unrelated ranked candidates for century-like query", () => {
    const members = [
        {
            preferredName: "Daśābatāra tāsa",
            variantName: ["Dashabatar Cards", "Dashabatar-Karten"],
            gndIdentifier: "1326314572",
            type: ["SubjectHeading"],
        },
        {
            preferredName: "Tonadilla",
            variantName: [],
            gndIdentifier: "4406473-1",
            type: ["SubjectHeading"],
        },
    ];

    const selected = selectBestGndCandidate(members, "16. Jahrhundert");
    assert.equal(selected, null);
});

test("keeps valid contains/exact style candidates", () => {
    const members = [
        {
            preferredName: "Alte Schwabacher <Frankfurt am Main, 17. Jh.>",
            variantName: ["Antike Schwabacher"],
            gndIdentifier: "7647166-4",
            type: ["SubjectHeading"],
        },
        {
            preferredName: "Some unrelated heading",
            variantName: [],
            gndIdentifier: "1234567890",
            type: ["SubjectHeading"],
        },
    ];

    const selected = selectBestGndCandidate(members, "17. Jh.");
    assert.ok(selected);
    assert.equal(selected.best.preferredName, "Alte Schwabacher <Frankfurt am Main, 17. Jh.>");
});

test("rejects non-exact contains match for acronym-like query", () => {
    const members = [
        {
            preferredName: "ADAC Tourismuspreis Bayern",
            variantName: ["Bayerischer Tourismuspreis"],
            gndIdentifier: "105147812X",
            type: ["SubjectHeading"],
        },
    ];

    const selected = selectBestGndCandidate(members, "ADAC");
    assert.equal(selected, null);
});

test("prefers whole-token match for short query over partial-in-word hit", () => {
    const members = [
        {
            preferredName: "AC²-Innovationspreis Region Aachen",
            variantName: ["AC2-Innovationspreis Region Aachen"],
            gndIdentifier: "1225836468",
            type: ["SubjectHeading"],
        },
        {
            preferredName: "Aach (Freudenstadt)",
            variantName: [],
            gndIdentifier: "2032610-5",
            type: ["SubjectHeading"],
        },
    ];

    const selected = selectBestGndCandidate(members, "Aach");
    assert.ok(selected);
    assert.equal(selected.best.preferredName, "Aach (Freudenstadt)");
});

test("prefers explicit exact match for Aachen over contains candidate", () => {
    const members = [
        {
            preferredName: "AC²-Innovationspreis Region Aachen",
            variantName: ["AC2-Innovationspreis Region Aachen"],
            gndIdentifier: "1225836468",
            type: ["SubjectHeading"],
        },
        {
            preferredName: "Aachen",
            variantName: ["Aquisgrana"],
            gndIdentifier: "4000036-3",
            type: ["PlaceOrGeographicName"],
        },
    ];

    const selected = selectBestGndCandidate(members, "Aachen");
    assert.ok(selected);
    assert.equal(selected.best.preferredName, "Aachen");
});

test("uses context tokens to disambiguate ambiguous place candidates", () => {
    const members = [
        {
            preferredName: "Aach (Linzgau)",
            variantName: ["Aach (im Linzgau)", "Aach (Pfullendorf)"],
            gndIdentifier: "4556723-2",
            type: ["AuthorityResource", "TerritorialCorporateBodyOrAdministrativeUnit", "PlaceOrGeographicName"],
        },
        {
            preferredName: "Aach (Landkreis Konstanz)",
            variantName: [],
            gndIdentifier: "4084608-8",
            type: ["TerritorialCorporateBodyOrAdministrativeUnit", "PlaceOrGeographicName", "AuthorityResource"],
        },
    ];

    const selected = selectBestGndCandidate(members, "Aach", {
        contextTokens: ["landkreis", "konstanz", "baden", "wurttembergischen"],
    });

    assert.ok(selected);
    assert.equal(selected.best.preferredName, "Aach (Landkreis Konstanz)");
});

