import { atom } from "recoil"

export const projectsState = atom({
  key: "projectsState",
  default: [],
})

export const skillsState = atom({
  key: "skillsState",
  default: [],
})

export const contactFormState = atom({
  key: "contactFormState",
  default: {
    name: "",
    email: "",
    message: "",
  },
})
