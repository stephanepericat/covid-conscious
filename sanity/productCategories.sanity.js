import groq from "groq";

export default groq`
  *[_type  == "productCategory"] | order(name[$locale] asc)
`;
