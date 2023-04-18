import { graphql, useStaticQuery } from "gatsby"

const useSiteMetadata = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          image
          description
          siteUrl
          social {
            twitter
          }
        }
      }
    }
  `)

  return data.site.siteMetadata
}

export default useSiteMetadata
