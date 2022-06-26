import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Router from "next/router";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.css";
import db from "../utils/db";

export async function getServerSideProps(ctx) {
  const res = await axios.get("http://localhost:3000/api/home");

  const data = res.data.data;
  // data.data.isLiked = false;

  /*
  const datas = JSON.stringify({
    collection: "posts",
    database: "test",
    dataSource: "Cluster0",
  });

  const config = {
    method: "post",
    url: "https://data.mongodb-api.com/app/data-zmirn/endpoint/data/v1/action/find",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key":
        "ilbpBNqGl4ECqjrevHqWIcBLCpRuBT7CSIk4ubU651EG43VHyHSGIS2gkP4Jgxcz",
    },
    data: datas,
  };

  const data = await axios(config)
    .then(function (response) {
      return response.data.documents;
    })
    .catch(function (error) {
      console.log(error);
    });

  console.log(data);
*/
  /*
S
  conso

  Menambahkan isLiked agar memudahkan logic tombol like untuk setiap post
  Jika tidak ditambahkan, pencet like akan ke semua post

  */

  //const data = await res.json();
  // console.log(res);

  //data.data.map((dta) => {
  //  return (dta.isLiked = false);
  //});

  return {
    props: { data },
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.data);

  const postsStoragez = posts.filter((post) => {
    return post.isValue == true;
  });

  dayjs.extend(localizedFormat);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const [description, setDescription] = useState("");
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [tempId, setTempId] = useState();
  const [tempLike, setTempLike] = useState();
  const [likeSubmit, setLikeSubmit] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  //const [nonLikedPost, setNonLiked] = useState([]);

  const generateId = () => {
    const min = 1000;
    const max = 9999;
    const result = Math.random() * (max - min) + min;
    const result2 = Math.floor(result); //3
    const username = `USER0X${result2}`;
    return username;
  };

  const getRandomPics = () => {
    const randomPics = [
      "https://i.ibb.co/xHzyVtT/memoji11.png",
      "https://i.ibb.co/1sZbstS/memoji5.png",
      "https://i.ibb.co/X7RJSdZ/memoji6.png",
      "https://i.ibb.co/fqkNT8s/memoji1.png",
      "https://i.ibb.co/QYppPC4/memoji9.png",
      "https://i.ibb.co/1Z1hc3r/memoji10.png",
      "https://i.ibb.co/r0K1QGB/memoji7.png",
      "https://i.ibb.co/T1Tsv2Y/memoji8.png",
      "https://i.ibb.co/xHzyVtT/memoji11.png",
      "https://i.ibb.co/QYppPC4/memoji9.png",
    ];

    const min = 0;
    const max = 9;
    const result = Math.random() * (max - min) + min;
    const result2 = Math.floor(result); //3
    const randomUrlPics1 = randomPics[result2];
    return randomUrlPics1;
  };

  const postHandler = async (e) => {
    e.preventDefault();
    const likes = 0;
    const name = generateId();
    const urlPics = getRandomPics();

    const post = {
      name,
      description,
      likes,
      urlPics,
    };

    try {
      const res = await fetch("/api/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      //content.data cukup sekali aja datanya
      const content = await res.json();
      content.data
        .sort((a, b) =>
          dayjs(a.createdAt).format("llll") > dayjs(b.createdAt).format("lll")
            ? -1
            : 1
        )
        .slice(0, 4)
        .map((cnt) => {
          return cnt;
        });
      console.log(content.data);
      setPosts(content.data);
      setPostSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const likeHandler = (postId, postLikes) => {
    console.log(postId, postLikes);
    setTempId(postId);
    setTempLike(postLikes);
    setLikeSubmit(true);

    const findPostIndex = posts.findIndex((post) => {
      return postId == post._id;
    });

    posts[findPostIndex].isLiked = true;
    //const postLiked = posts[findPostIndex];

    //   const postLiked = posts[findPostIndex];

    /*
    const listLikedPost = JSON.parse(
      window.localStorage.getItem("likedPost") || "[]"
    );

     listLikedPost.push(postLiked);

     window.localStorage.setItem("likedPost", JSON.stringify(listLikedPost));
     */
  };

  //              LIKE SUBMIT

  const likeSubmitHandler = async () => {
    let likesData = tempLike + 1;
    const likes = {
      likes: likesData,
    };
    console.log(likes);

    try {
      const res = await fetch(`/api/post/like/${tempId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(likes),
      });
      console.log(likes);
      const data = await res.json();
      console.log(data);
      setLikeSubmit(true);
    } catch (err) {
      console.log(err);
    }
  };

  const commentHandler = (postId) => {
    console.log(postId);
    Router.push(`/post/${postId}`);
  };

  if (likeSubmit) likeSubmitHandler();

  return (
    <div>
      <div style={{ backgroundColor: "#181818" }}>
        <div className="containerz">
          <div className="rowz">
            <button
              className="btn btn-primary btn-popular"
              style={{
                backgroundColor: "#d7d7d7",
                color: "#1c72dc",
                borderColor: "#d7d7d7",
                fontWeight: "bolder",
              }}
            >
              💥 SHOW POPULAR POSTS 💥
            </button>

            {postSubmitted ? (
              <>
                <div className="title2">SUBMIT SUCCESS</div>
              </>
            ) : (
              <>
                <form type="submit" onSubmit={postHandler}>
                  <textarea
                    style={{ resize: "none", height: 50 }}
                    className="form-control"
                    type="text"
                    defaultValue={description}
                    placeholder="Add a post..."
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                  <button
                    className="btn btn-primary btn-buat"
                    style={{
                      backgroundColor: "#1258ae",
                      color: "#d7d7d7",
                      borderColor: "#1258ae",
                      fontWeight: "bolder",
                    }}
                    type="submit"
                  >
                    SEND
                  </button>
                </form>
              </>
            )}

            {posts &&
              posts
                .sort((a, b) =>
                  dayjs(a.createdAt).format("llll") >
                  dayjs(b.createdAt).format("lll")
                    ? -1
                    : 1
                )
                .slice(0, 4)
                .map((post) => {
                  return (
                    <div key={post._id}>
                      <div className="cardz">
                        <div className="cardz-header">
                          <div className="title">&quot;{post.name}&quot;</div>
                        </div>
                        <div className="cardz-body position-relative">
                          <div className="recurso1 position-absolute top-0 start-0">
                            <Image
                              width="57"
                              height="57"
                              src="https://i.ibb.co/q5wH8W6/Untitled-1.png"
                              alt="qr-code"
                            />
                          </div>
                          <div className="recurso2 position-absolute top-0 end-0">
                            <Image
                              src="https:///i.ibb.co/m44QMtm/Recurso-28-MODERN-ICONS.png"
                              alt="block-square"
                              width="150"
                              height="76"
                            />
                          </div>
                          <div className="recurso3 position-absolute bottom-0 end-0">
                            <Image
                              width="80"
                              height="75"
                              src="https:///i.ibb.co/BCzvpJP/asa.png"
                              alt="checkboard"
                            />
                          </div>
                          <div className="position-absolute top-0 start-0 mt-3 atas-kiri">
                            VIA &#160;
                            <span style={{ fontStyle: "italic" }}>
                              STRANGERZ
                            </span>
                            <br />
                            {dayjs(post.createdAt).format("lll")}
                          </div>
                          <div className="position-absolute top-0 end-0 mt-3 atas-kanan">
                            PICS ©MEMOJI <br /> -6.914864, 107.608238
                          </div>

                          <div className="position-absolute start-50 translate-middle comment-c">
                            <div
                              className="comment position-relative"
                              style={{ fontWeight: "bolder", color: "black" }}
                            >
                              <p style={{ color: "black" }}>
                                &quot;{post.description}&quot;
                              </p>
                              <div
                                className="position-absolute top-100 start-0 translate-middle love-emoticon"
                                onClick={() => {
                                  likeHandler(post._id, post.likes);
                                }}
                              >
                                {post.isLiked ? (
                                  <div>
                                    <div className="instagram-heart top-50 start-50 "></div>
                                    <div className="position-relative">
                                      💖
                                      <div
                                        className="position-absolute top-50 start-50 translate-middle"
                                        style={{ fontSize: 10, color: "black" }}
                                      >
                                        {post.likes + 1}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="position-relative">
                                    🤍
                                    <div
                                      className="position-absolute top-50 start-50 translate-middle"
                                      style={{
                                        fontSize: 10,
                                        color: "black",
                                        marginBottom: 5,
                                      }}
                                    >
                                      {post.likes}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="position-absolute top-100 start-100 translate-middle comment-emoticon">
                                <div
                                  onClick={() => {
                                    commentHandler(post._id);
                                  }}
                                  className="position-relative"
                                  style={{ cursor: "pointer" }}
                                >
                                  🗨️
                                  <div
                                    className="position-absolute top-50 start-50 translate-middle"
                                    style={{
                                      fontSize: 10,
                                      color: "black",
                                      marginBottom: 5,
                                    }}
                                  >
                                    {post.commentId.length}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="position-absolute bottom-0 start-0 kiri-bawah ">
                            MADE BY <br /> SAMRMDHN
                          </div>

                          <div className="img-container">
                            {/*
                            <Image
                              onDoubleClick={() => {
                                likeHandler(post._id, post.likes);
                              }}
                              src={post.urlPics}
                              height="290"
                              width="240"
                              alt="image"
                            />
                            */}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}
