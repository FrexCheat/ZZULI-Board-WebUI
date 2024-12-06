<script setup lang="ts">
import { SocialLink } from '../utils/constant'
</script>

<template>
  <header flex flex-row pt-2 ps-3 pr-3 pb-5 justify-end>
    <div flex gap-2>
      <t-link hover="color" :href="SocialLink.GITHUB_REPO" target="_blank">
        <template #prefix-icon>
          <LogoGithubFilledIcon size="27" />
        </template>
      </t-link>
      <t-link hover="color" :href="SocialLink.MYQQ_GROUP" target="_blank">
        <template #prefix-icon>
          <LogoQqFilledIcon size="27" />
        </template>
      </t-link>
    </div>
  </header>
</template>
