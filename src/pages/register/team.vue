<script setup lang="ts">
import { TeamRegisterData } from '../../libs/types/register'
import { Contest, getContestNormalConfig } from '../../libs/core/contest'
import { FormInstanceFunctions, FormProps, MessagePlugin } from 'tdesign-vue-next'
import { registerTeam } from '../../libs/core/register'
const groupLink = SocialLink.MYQQ_GROUP
const route = useRoute()
const infoLoading = ref(true)
const contestData = ref<Contest | null>(null)
const form = ref<FormInstanceFunctions>({} as FormInstanceFunctions)
const regFormData = reactive<TeamRegisterData>({
  reg_code: '',
  name: '',
  coach: '',
  school: '',
  college: '',
  class: '',
  members: [],
})
const onSubmit: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult === true) {
    await registerTeam(contestData.value!.id, regFormData)
  }
}
const addMember = () => {
  regFormData.members.push({ id: '', name: '', college: '', class: '', phone: '', qq: '' })
}
const removeMember = (index: number) => {
  regFormData.members.splice(index, 1)
}
const getContestData = async () => {
  const contestId = route.query.contest_id as string
  if (!contestId) {
    MessagePlugin.error('比赛 ID 为空!')
  } else {
    contestData.value = await getContestNormalConfig(contestId)
  }
  infoLoading.value = false
}
onMounted(async () => {
  useTitle('团队报名 | ZZULI Board')
  await getContestData()
})
</script>

<template>
  <main flex justify-center>
    <Loading v-if="infoLoading"></Loading>
    <t-empty v-else-if="!contestData" size="large" />
    <div v-else w-960px flex flex-col gap-3>
      <div flex gap-3 justify-center items-center>
        <UsergroupAddIcon size="30" />
        <span text-size-2xl font-700>{{ contestData.title }} - 团队报名</span>
      </div>
      <t-alert theme="warning">
        <template #message>
          请仔细填写以下信息，尽量一次完成。在提交之前务必保证每位队员的学号准确无误，学号错误将无法计入成绩！如果信息提交有误，可加入群聊联系比赛管理员申请修改 ->
          <t-link underline theme="primary" :href="groupLink" target="_blank"> 点击加入比赛群聊 </t-link>
        </template>
      </t-alert>
      <t-form ref="form" :data="regFormData" label-align="left" :requiredMark="false" labelWidth="70px" @submit="onSubmit">
        <t-form-item label="邀请码" name="reg_code" :rules="[{ required: true }]">
          <t-input v-model="regFormData.reg_code"></t-input>
        </t-form-item>
        <t-form-item label="队伍名称" name="name" :rules="[{ required: true }]">
          <t-input v-model="regFormData.name"></t-input>
        </t-form-item>
        <t-space w-960px mb-6 :size="20">
          <t-form-item label="所属学校" name="school" :rules="[{ required: true }]">
            <t-input v-model="regFormData.school"></t-input>
          </t-form-item>
          <t-form-item label="所属学院" name="college" :rules="[{ required: true }]">
            <t-input v-model="regFormData.college"></t-input>
          </t-form-item>
          <t-form-item label="所属班级" name="class" :rules="[{ required: true }]">
            <t-input v-model="regFormData.class"></t-input>
          </t-form-item>
        </t-space>
        <t-space v-for="(member, index) in regFormData.members" direction="vertical" mb-6 :size="8" w-960px>
          <t-space mb-3 :size="8" w-960px>
            <t-form-item :label="index === 0 ? '队长' : `队员 ${index}`" :name="`members[${index}].name`" :rules="[{ required: true, message: '姓名不能为空' }]">
              <t-input v-model="member.name" placeholder="姓名"></t-input>
            </t-form-item>
            <t-form-item
              label-width="20"
              :name="`members[${index}].id`"
              :rules="[
                { required: true, message: '学号不能为空' },
                { pattern: /^\d+$/, message: '学号只能为数字' },
              ]"
            >
              <t-input v-model="member.id" placeholder="学号"></t-input>
            </t-form-item>
            <t-form-item
              label-width="20"
              :name="`members[${index}].phone`"
              :rules="[
                { required: true, message: '电话不能为空' },
                { telnumber: true, message: '电话格式错误' },
              ]"
            >
              <t-input v-model="member.phone" placeholder="联系电话"></t-input>
            </t-form-item>
            <t-form-item
              label-width="20"
              :name="`members[${index}].qq`"
              :rules="[
                { required: true, message: 'QQ不能为空' },
                { pattern: /^\d+$/, message: 'QQ只能为数字' },
              ]"
            >
              <t-input v-model="member.qq" placeholder="QQ号码"></t-input>
            </t-form-item>
          </t-space>
          <t-space :size="8" w-960px>
            <t-form-item :name="`members[${index}].college`" :rules="[{ required: true }]">
              <t-input v-model="member.college" placeholder="学院"></t-input>
            </t-form-item>
            <t-form-item label-width="20" :name="`members[${index}].class`" :rules="[{ required: true }]">
              <t-input v-model="member.class" placeholder="班级"></t-input>
            </t-form-item>
            <t-button block @click="removeMember(index)">
              <template #icon>
                <DeleteIcon />
              </template>
              删除
            </t-button>
          </t-space>
        </t-space>
        <t-form-item label-width="0">
          <t-button v-if="regFormData.members.length < 10" block variant="dashed" @click="addMember()">
            <template #icon>
              <PlusIcon />
            </template>
            添加队员
          </t-button>
        </t-form-item>
        <t-form-item label-width="0">
          <t-button type="submit" block> 提交 </t-button>
        </t-form-item>
      </t-form>
    </div>
  </main>
</template>

<route lang="yaml">
meta:
  layout: normal-page
</route>
