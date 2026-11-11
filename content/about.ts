import { Certificate, Medal } from "@phosphor-icons/react/dist/ssr";

export const education = [
  {
    year: "2025",
    title: "B.Tech, Computer Science",
    place: "Dr. A.P.J. Abdul Kalam Technical University",
    note: "CGPA 7.0",
  },
  { year: "2021", title: "Intermediate", place: "A.L.S Academy", note: "69%" },
  { year: "2019", title: "High School", place: "A.L.S Academy", note: "69%" },
] as const;

export const achievements = [
  { title: "Runner-up, group discussion", note: "College competition", icon: Medal },
  { title: "Course on Computer Concepts (CCC)", note: "Certified by NIELIT", icon: Certificate },
] as const;

export const project = {
  title: "Hospital Management System",
  stack: "HTML, CSS, JavaScript, Python, MySQL",
  body: "Patients search for a specialist, see which time slots are free and book one. The database won't let two people take the same slot, and admins, doctors and patients each get their own login.",
} as const;
