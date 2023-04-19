/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { GitHub, Linkedin } from "react-feather"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50, quality: 95) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  const avatar = data?.avatar?.childImageSharp?.fixed

  return (
    <div className="bio">
      {avatar && (
        <Image
          fixed={avatar}
          alt={author?.name || ``}
          className="bio-avatar"
          imgStyle={{
            borderRadius: `50%`,
          }}
        />
      )}
      <div className="flex flex-col">
        {author?.name && (
          <p className="text-gray-600 dark:text-gray-300">
            Written by{" "}
            <strong className="text-gray-800 dark:text-gray-100">
              {author.name}
            </strong>{" "}
            {author?.summary || null}
          </p>
        )}
        <div className="bio-social">
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://github.com/${social?.github || ``}`}
          >
            <GitHub size={18} />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.linkedin.com/in/${social?.linkedin || ``}`}
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Bio
