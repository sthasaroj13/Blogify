import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import unknown from "../images/unknown.jpg";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

export default function PostAuthor({ creator, createdAt }) {
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${creator}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAuthor(data);
        } else {
          console.error("Failed to fetch author data");
        }
      } catch (error) {
        console.error("Error fetching author data:", error);
      }
    };

    getAuthor();
  }, [creator]);

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-4">
        {author ? (
          <Link to={`/posts/users/${creator}`}>
            {author.avatar ? (
              <img
                src={`${"http://localhost:5000"}/uploads/${author.avatar}`}
                alt=""
                className="h-16 mt-2 rounded-md"
                style={{ display: "inline-block" }}
              />
            ) : (
              <img
                src={unknown}
                alt=""
                className="h-16 mt-2 rounded-md"
                style={{ display: "inline-block" }}
              />
            )}
          </Link>
        ) : (
          <img
            src={unknown}
            alt=""
            className="h-16 mt-2 rounded-md"
            style={{ display: "inline-block" }}
          />
        )}
        <div className=" mt-3">
          <h5>By: {author ? author.name : "Unknown"}</h5>
          <small>
            <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
          </small>
        </div>
      </div>
    </>
  );
}
