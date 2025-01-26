import React, { useRef, useState, useEffect } from "react";
import {
  EditorJS,
  Header,
  List,
  LinkTool,
  Embed,
  RawTool,
  ImageTool,
  Quote,
  Table,
} from "./tools";
import Preview from "./Preview";
import { getImageData } from "./apiCalls";

const EditBlog = ({ props }) => {
  const [content, setContent] = useState({
    blocks: props ? (props.content ? props.content : []) : [],
  });
  const [title, setTitle] = useState(props && props.title ? props.title : "");
  const [tags, setTags] = useState([]);
  const [inputField, setInputField] = useState("");

  const ejInstance = useRef();
  const [isEdit, setEdit] = useState(true);
  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      onReady: () => {
        ejInstance.current = editor;
      },
      data: { blocks: content.blocks },
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,

          config: {
            placeholder: "Enter a header",
            levels: [1],
            defaultLevel: 1,
          },
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                return getImageData(file);
              },
            },
          },
        },
        raw: RawTool,
        table: Table,
        linkTool: {
          class: LinkTool,
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
        embed: Embed,
        quote: Quote,
      },
      autofocus: true,
      onChange: async () => {
        let temp = await editor.saver.save();
        setContent(temp);
      },
    });
  };
  useEffect(() => {
    setEdit(false);
    setEdit(true);
  }, []);

  ///DO NOT REMOVE THIS USEEFFECT
  useEffect(() => {
    initEditor();
    console.log(content);
    return async () => {
      await ejInstance.current?.destroy();
      ejInstance.current = null;
    };
  }, [isEdit]);

  return (
    <>
      {isEdit ? (
        <div className="w-[70vw] mx-auto my-[7rem] flex flex-col gap-5">
          <div className="flex justify-start items-center ">
            <h1 className="text-gray-900 font-bold text-lg flex-1">
              Edit your blog below and when you're ready click the button aside
              to preview
            </h1>
            <button
              className="bg-black rounded-full text-white font-bold p-2 px-4 hover:bg-gray-500"
              onClick={() => setEdit(false)}
            >
              Preview
            </button>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              value={title}
              className="w-full p-3 outline-none focus:outline-black rounded "
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="Choose a title for your post"
            />
          </form>
          <div className="flex items-center gap-1">
            {tags?.map((el, index) => (
              <h1  key ={index} className="font-bold">{"#"+el}</h1>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTags([...tags, inputField.replaceAll(" ", "")]);
                setInputField("");
              }}
            >
              <input
                value={inputField}
                className="w-full p-3 outline-none focus:outline-black rounded "
                onChange={(e) => {
                  setInputField(e.target.value);
                }}
                placeholder="Add a tag (no spaces, spaces will be removed)"
              />
            </form>
          </div>
          <div
            id="editorjs"
            className="border-gray-500 border-[1px] pt-6 rounded-xl h-[full] min-h-[80vh]"
          ></div>
        </div>
      ) : (
        <Preview
          props={{
            title,
            content,
            setEdit,
            tags,
            id: props ? props._id : false,
          }}
        ></Preview>
      )}
    </>
  );
};

export default EditBlog;
