import groq from "groq";

export default groq`
  *[_type in ["productCategory"]] | order(title asc)
`;
