<script setup lang="ts">
import { SocialLink } from '../utils/constant'
</script>

<template>
  <footer flex flex-col gap-6 mt-20>
    <div flex justify-center items-center gap-5>
      <Logo text-size-2xl />
      <span text-size-2xl font-800>ZZULI Contest Board</span>
    </div>
    <div flex justify-center>
      <span font-500>Online Board Service of GPLT and ACM</span>
    </div>
    <div flex justify-center gap-10>
      <t-link size="large" href="/">
        <template #suffix-icon>
          <JumpIcon />
        </template>
        Home
      </t-link>
      <t-link size="large" :href="SocialLink.GITHUB_REPO" target="_blank">
        <template #suffix-icon>
          <LogoGithubFilledIcon />
        </template>
        Repo
      </t-link>
      <t-tooltip content="admin@frexlink.com" placement="right">
        <t-link size="large" href="mailto:admin@frexlink.com">
          <template #suffix-icon>
            <MailIcon />
          </template>
          Mail
        </t-link>
      </t-tooltip>
    </div>
    <div flex justify-center>
      <span font-500>© 2024 ZZULI Contest Board</span>
    </div>
  </footer>
</template>
