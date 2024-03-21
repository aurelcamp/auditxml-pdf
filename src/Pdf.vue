<script setup>
import { onServerPrefetch, ref } from 'vue';
import Bloc1 from '@/Bloc1.vue';
import axios from 'axios'
import { XMLParser } from 'fast-xml-parser';
import { inject } from 'vue'

const chapter1 = ref(1)
const auditeurNom = ref('')

async function fetch() {
    try {
    const xmlUrl = inject('xmlUrl')
    const response = await axios.get(xmlUrl)
    const data = response.data
    const parser = new XMLParser();
    const doc = parser.parse(data)
    auditeurNom.value = doc.audit.administratif.auditeur.nom_auditeur;

    } catch(e) {
      console.log(e)
    }
}

if (!auditeurNom.value) fetch()


onServerPrefetch(async() => {
    chapter1.value = 112
    await fetch()
})

</script>

<template>
  <main>
    <section class="chapter">
      <h2>Auditeur : {{ auditeurNom }} </h2>
      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Duis nibh tortor</p>

      <Bloc1 />
    </section>

    <section class="chapter">
      <h2>Chapter {{ chapter1 }}</h2>
      <p>Voici du texte</p>
      <!-- <img src="@/assets/images/img1.jpg" alt="img1" /> -->
      <img src="/images/img1.jpg" alt="img1" />
      <img src  =   "  /images/img1.jpg" alt="img1" />
      <br>
      <img src="https://fastly.picsum.photos/id/140/536/354.jpg?hmac=6DR6dNVwKNG_j1OeVto6gRHHfkxwnE5JEtDaWl6qkDg" alt="img2" />
    </section>

    <section class="chapter">
      <h2>Chapter 2</h2>
      <p>consectetur adipiscing elit</p>
    </section>

    <section class="chapter">
      <h2>Chapter 3</h2>
      <p>Duis nibh tortor, pellentesque eu suscipit vel</p>
    </section>
  </main>
</template>

<style>
@page {
  size: A4;
  margin: 20mm 15mm 26mm 15mm;
}

h2 {
  break-before: page;
}

img {
  width: 100px;
  height: auto;
}
</style>
