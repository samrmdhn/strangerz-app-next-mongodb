import React, { useState, useEffect, useForceUpdate } from "react";import axios from "axios";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.css";
import Link from "next/link";
import Image from "next/image";
/*

NOTES: 

  -> GET DATA
      1. Get data dilakukan pada server side karena id bisa langsung didapat. 
      2. Jika menggunakan useEffect untuk fetch data otomatis menggunakan useRouter untuk mendapatkan query.
      Kekurangan dari cara ini adalah useEffect dieksekusi terlebih dahulu dibanding mendatpatkan { id } dari query 
      dan menghasilkan undefined ketika dimasukkan ke state
      3. Data dari server side dimasukkan kepada state [post, setPost], sehingga data dapat dimanipulasi dan rerender component
      dapat dilakukan

  -> POST COMMENT
      1. Alur post comment untuk mongoDB
          -> Value dari input (e.target.value)
          -> formSubmitHandler (e.preventDefault())
          -> Data dari input dijadikan object terlebih dahulu, 
              const comments = {
                    commentBody (property mongoDB) : commentBodyInput (value dari input)
              }
          -> JSON.stringify(comments), untuk dijadikan JSON
    
    -> PUT LIKES



*/

export async function getServerSideProps(ctx) {
  const { id } = ctx.query;
  /*
  const idFix = {
    id,
  };
  const datas = JSON.stringify({
    dataSource: "Cluster0",
    database: "test",
    collection: "posts",
    
    projection: {
      _id: id,
    },
    
    filter: {
      name: idFix.id,
    },
  });

  const config = {
    method: "post",
    url: `https://data.mongodb-api.com/app/data-zmirn/endpoint/data/v1/action/findOne`,
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
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  console.log(data);
*/

  const res = await fetch("https://strngrz666.vercel.app/api/post/" + id, {
    method: "GET",
  });

  const data = await res.json();
  data.data.isLiked = false;

  return {
    props: { id, data },
  };
}

export default function PostLists(props) {
  const [post, setPost] = useState(props.data.data);

  dayjs.extend(localizedFormat);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const id = props.id;

  /*
  useEffect(() => {


    if (window.localStorage.getItem("likedPost") !== null) {
      //console.log(parsedData);

      //   setTimeout(() => {
      const datas = window.localStorage.getItem("likedPost");
      const parsedDatas = JSON.parse(datas);
      const filteredData = parsedDatas.filter((parsedata) => {
        return parsedata._id == post._id;
      });
      //    post.isLiked = filteredData[0].isLiked;
      setPost(filteredData[0]);
      //   setPost();
      // const parsedData = JSON.parse(data);
      //    post.isLiked = true;
      //  post.likes = parsedData.likes;
      //setPost(parsedData);
      // console.log(parsedData);
      // console.log("JANCUK IKI!");
      //   }, 100);
    }
  }, []);
  */
  /*
  useEffectOnce(() => {
    if (window.localStorage.getItem(id) !== null) {
      //console.log(parsedData);

      setTimeout(() => {
        const data = window.localStorage.getItem(id);
        const parsedData = JSON.parse(data);
        //    post.isLiked = true;
        //  post.likes = parsedData.likes;
        setPost(parsedData);
        console.log("JANCUK IKI!");
      }, 100);
    }
  }, []);
*/
  /*
  useLayoutEffect(() => {
    const data = window.localStorage.getItem(id);
    if (typeof data !== undefined) {
      post.isLiked = true;
    }
  });
  */
  /*
  useEffect(() => {
    const timer = setTimeout(() => {
      const data = window.localStorage.getItem(id);
      if (typeof data !== undefined) {
        post.isLiked = true;
      }
    }, 10);
    //const data2 = JSON.parse(data);
  }, []);

*/
  //post.isLiked =
  /*
  useEffect(() => {
    const data = window.localStorage.getItem(id);
    console.log(data);
    if (typeof data !== undefined) {
      post.isLiked = true;
    }
  }, []);
*/
  //Data server side rendering bisa dimanipulasi dengan dimasukkan kepada state
  const [commentBodyTemp, setCommentBodyTemp] = useState("");
  const [postComment, setPostComment] = useState(props.data.data.commentId);
  console.log(props.data.commentId);
  const [tempId, setTempId] = useState();
  const [tempLike, setTempLike] = useState();
  const [likeSubmit, setLikeSubmit] = useState(false);

  const commentHandler = async (e) => {
    e.preventDefault();
    const cmt = commentBodyTemp;
    const comment = { commentBody: cmt };

    try {
      const res = await fetch(`/api/post/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });
      const content = await res.json();
      /*
      respon dari comment ini adalah seperti get post(semua data diambil) agar
      data yang diovewrite sama dan tidak error, kemudian dikembalikan
      kembali pada state post untuk rerender
      */
      // post.comment = content.data.comment;

      setPostComment(content.data.commentId);
    } catch (error) {
      console.log(error);
    }
    setCommentBodyTemp("");
  };

  const likeHandler = (postId, postLikes) => {
    console.log(postId, postLikes);
    setTempId(postId);
    setTempLike(postLikes);
    setLikeSubmit(true);

    post.isLiked = true;
  };

  const likeSubmitHandler = async () => {
    let likesData = tempLike + 1;
    const likes = {
      likes: likesData,
    };

    try {
      const res = await fetch(`/api/post/like/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(likes),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (likeSubmit) likeSubmitHandler();

  return (
    <>
      <div style={{ backgroundColor: "#181818" }}>
        <div className="containerz">
          <div className="rowz">
            <div className="cardz" style={{ marginTop: 30 }}>
              <Link href="/">
                <div
                  style={{ cursor: "pointer" }}
                  className="arrow-back position-absolute top-0 start-0 translate-middle"
                >
                  ←
                </div>
              </Link>
              <div className="cardz-header">
                <div className="title"> &quot;{post.name}&quot;</div>
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
                  VIA <span style={{ fontStyle: "italic" }}>STRANGERZ</span>{" "}
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
                      {" "}
                      &quot;{post.description} &quot;
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
                      <div className="position-relative">
                        🗨️
                        <div
                          className="position-absolute top-50 start-50 translate-middle"
                          style={{
                            fontSize: 10,
                            color: "black",
                            marginBottom: 5,
                          }}
                        >
                          {postComment.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="position-absolute bottom-0 start-0 kiri-bawah ">
                  MADE BY <br /> SAMRMDHN
                </div>

                <div className="img-container">
                  <Image
                    onDoubleClick={() => {
                      likeHandler(post._id, post.likes);
                    }}
                    src={post.urlPics}
                    height="290"
                    width="240"
                    alt="image"
                  />
                </div>
              </div>
              <div className=" cardz-footer"></div>
            </div>
            <div className="title2">COMMENTS</div>
            {postComment.map((comment) => {
              return (
                <div key={comment._id} className="cardz-comments">
                  <div className="cardz-comments-header">
                    <div className="row">
                      <div className="col-lg-5"></div>
                      <div className="col">
                        {dayjs(comment.createdAt).format("lll")}
                      </div>
                    </div>
                  </div>
                  <div className="cardz-comments-body ">
                    {comment.commentBody}
                  </div>
                  <div className="cardz-comments-footer"></div>
                </div>
              );
            })}

            <form type="submit" onSubmit={commentHandler}>
              <textarea
                style={{ resize: "none", height: 50 }}
                className="form-control"
                value={commentBodyTemp}
                placeholder="Add a comment..."
                onChange={(e) => {
                  setCommentBodyTemp(e.target.value);
                }}
              />
              <button
                className="btn btn btn-buat"
                style={{
                  backgroundColor: "#1c72dc",
                  color: "#d7d7d7",
                  borderColor: "#1c72dc",
                  fontWeight: "bolder",
                }}
                type="submit"
              >
                SEND
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
