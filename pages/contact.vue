<script setup lang="ts">
interface ApiPage {
  "data": {
        "id": number,
        "attributes": {
            "title": string,
            "createdAt": string,
            "updatedAt": string,
            "publishedAt": string,
            "locale": string,
            "FAQs": FAQ[]
            "DescriptionCK": string
        }
    },
    "meta": {}
}

interface FAQ {
  id: number,
  Question: string,
  Answer: string
}
definePageMeta({
    auth: false
});
//const response:ApiPage = await $fetch<ApiPage>(`http://localhost:1337/api/pages/1?populate=*`);
//http://localhost:1337/api/articles/1?populate=*
const response = null;

</script>
<template>
  <div>
    <div class="container">
      <div class="breadcrumbs text-sm">
        <ul>
          <li><a href="/">Home</a></li>
          <li>
            <span class="text-accent">
              {{ $t('help') }}
            </span>
          </li>
        </ul>
      </div>

      <div>
        <div
          role="alert"
          class="alert bg-neutral"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-info h-6 w-6 shrink-0"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>TODO: english version</span>
        </div>
      </div>
      <article class="container flex justify-center">
        <div
          id="c7273"
          class="frame frame-default frame-type-text frame-layout-0 w-2/3 text-balance text-justify"
        >
          <p>Im Projekt <em>AV-EFI Automatisiertes Verbundsystem für audiovisuelle Bestände über einheitliche Filmidentifikatoren</em> – Eigenschreibweise mit Projektstart <strong>AVefi</strong> – wird ein institutionsübergreifendes, webbasiertes System entwickelt und erprobt, mit Persistent Identifier (PID) in zentraler Rolle. Dieses soll der Identifikation und Verknüpfung von Filmen, ihren Fassungen und Datenobjekten aus heterogenen Beständen dienen.</p>
          <h3>Projektgegenstand</h3>
          <p>Die Vernetzung standardisierter wissenschaftlicher Metadaten über Institutionen hinweg ist ein übergeordnetes gesellschaftliches Ziel. Es ermöglicht effizientere Strukturen, weitere Innovationen und knüpft damit an die Tradition der großen Verbünde im Archiv- und Bibliotheksbereich an. Zu diesem übergeordneten Ziel leistet das Projekt <strong>AVefi </strong>einen neuartigen Beitrag auf dem Gebiet audiovisueller Bestände und ihrer Nachweise für die wissenschaftliche Forschung und das Kulturerbe. Es werden insbesondere Film- und Medienwissenschaften, aber auch die interdisziplinären Geistes- und Kulturwissenschaften, vor allem die Digital Humanities, adressiert.</p>
          <p>Im Projekt wird entwickelt und erprobt, wie ein institutionsübergreifendes, webbasiertes System, in dem Persistent Identifier (PID) eine zentrale Rolle spielen, als Forschungsinfrastruktur zur Identifikation von AV-Werken, den dazugehörenden Fassungen und Datenobjekten dient und wie sie miteinander verknüpft werden können. Das PID-System mit den einheitlichen Filmidentifikatoren (EFI) übernimmt die Funktion einer zentralen Datenbank, führt die existierenden Metadaten der unterschiedlichen Fassungen und Materialien aus den originalen Datenbanken verschiedener Institutionen strukturiert und möglichst automatisiert zusammen und sichert damit die freie und langfristige Verfügbarkeit dieser Informationen für die Öffentlichkeit. Dabei ist angedacht, die Disambiguierung und die Zuordnung der Metadaten verschiedener Institutionen durch automatische Synchronisations- und Abgleichsroutinen zu unterstützen. Das zu entwickelnde Verbundsystem einschließlich einer benutzungsfreundlichen Recherche- und Redaktionsoberfläche, soll das bereits verfügbare “Ökosystem” (filmischer) Identifikatoren und (Norm-)Daten (z.B. Filmportal, EIDR, GND, NFDI4Culture) sinnvoll ergänzen und sich in dieses als originäres Angebot mit starkem Bestandsbezug einfügen.</p>
          <h3>Projektziele</h3>
          <p>Das initiale zweijährige Projekt dient in enger Zusammenarbeit mit Praxispartnern und Vertreter*innen von Forschungscommunities nicht nur der beispielhaften, modularen Entwicklung und Erprobung des Systems auf technischer Ebene. Es gilt nicht zuletzt im intensiven Austausch, insbesondere bzgl. des Metadatenmanagements gemeinsam detaillierte Anforderungen, Regeln und Workflows im Verbund mit dem Ziel einer anknüpfüngsfähigen, dauerhaften Gestalt zu erarbeiten.&nbsp;</p>
          <p>Langfristig soll das System dem Nachweis und der Verknüpfung von AV-Beständen jeglicher Herkunft und Gattung dienen. Mit dem Projekt wird zudem eine Lücke bearbeitet: mit besonderem Blick auf Unterrichts-, Lehr und Wissenschaftsfilme sowie auf ephemeres Filmmaterial oder Amateurfilme sollen diese Gattungen erstmals in einem Verbundsystem als “kleiner” Film” neben dem “großen” Film der Forschung zur Verfügung stehen. Durch eine niedrigschwellige, automatisierte, ressourcenschonende Technologie, wird insbesondere auch kleineren Institutionen die Möglichkeit der Projektteilnahme und -teilhabe gegeben.</p>
          <h3>Akteure</h3>
          <p>Verbundprojektpartner sind: die TIB - Leibniz-Informationszentrum für Technik und Naturwissenschaften, die Stiftung Deutsche Kinemathek – Museum für Film und Fernsehen (SDK),&nbsp;Gesellschaft für wissenschaftliche Datenverarbeitung mbH Göttingen (GWDG) und das&nbsp;Filmmuseum der Landeshauptstadt Düsseldorf (FMDU). Diese werden von zehn Praxispartnern in verschiedenen Rollen begleitet und unterstützt</p>
        </div>
      </article>
    </div>
  </div>
</template>