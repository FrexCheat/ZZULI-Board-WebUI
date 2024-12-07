interface RegisterMember {
  id: string
  name: string
  college: string
  class: string
  phone: string
  qq: string
}

export interface TeamRegisterData {
  reg_code: string
  name: string
  coach: string
  school: string
  college: string
  class: string
  members: RegisterMember[]
}
