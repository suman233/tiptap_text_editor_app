import { useEditor, EditorContent, Editor, BubbleMenu, FloatingMenu, ReactRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useCallback } from "react";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Text from "@tiptap/extension-text";
import * as Icons from "@/components/Icons/Icons";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Dropcursor from "@tiptap/extension-dropcursor";
// import Youtube from "@tiptap/extension-youtube";
// import suggestion from '../Suggestion.tsx'
import classNames from "classnames";
import Image from "@tiptap/extension-image";
import { Button } from "@mui/material";
import CharacterCount from "@tiptap/extension-character-count";
import Mention from "@tiptap/extension-mention";
// import * as Suggestion from '../Suggestion/Suggestion'
import suggestion from '../Suggestion/Suggestion'
import { MentionList } from "../Mention/MentionList";
// import "./Tiptap.scss";
const content = `
<p>With the History extension the Editor will keep track of your changes. And if you think you made a mistake, you can redo your changes. Try it out, change the content and hit the undo button!</p>
<p>And yes, you can also use a keyboard shortcut to undo changes (Control/Cmd Z) or redo changes (Control/Cmd Shift Z).</p>
<p>Wow, this editor has support for links to the whole <a href="https://en.wikipedia.org/wiki/World_Wide_Web">world wide web</a>. We tested a lot of URLs and I think you can add *every URL* you want. Isn’t that cool? Let’s try <a href="https://statamic.com/">another one!</a> Yep, seems to work.</p>
<p>By default every link will get a <code>rel="noopener noreferrer nofollow"</code> attribute. It’s configurable though.</p>
<p><strong>This is bold.</strong></p>
<p><u>This is underlined though.</u></p>
<p><em>This is italic.</em></p>
<p><s>But that’s striked through.</s></p>
<p><code>This is code.</code></p>
`;


const TextEditor = () => {
  const editor = useEditor({
    extensions: [
      Document,
      TextStyle,
      Color,
      History,
      Paragraph,
      Text,
      //   Link.configure({
      //     openOnClick: false
      //   }),
      Bold,
      Underline,
      Italic,
      Strike,
      Code,
      Image,
      Dropcursor,
      CharacterCount,
      Mention.configure({
        HTMLAttributes: { class: "mentionNode" },
        suggestion: {
          render: () => {
            let reactRenderer: ReactRenderer;

            return {
              onStart: (props) => {
                reactRenderer = new ReactRenderer(MentionList, {
                  props,
                  editor: props.editor
                });
              },

              onUpdate(props) {
                reactRenderer?.updateProps(props);
              },

              onKeyDown(props) {
                if (props.event.key === "Escape") {
                  reactRenderer?.destroy();
                  return true;
                }

                return (reactRenderer?.ref as any)?.onKeyDown(props);
              },

              onExit() {
                reactRenderer.destroy();
              }
            };
          }
        }
      })
    ],
    content,
   
  }) as Editor;

  let limit: number = 280

  const percentage = editor
  ? Math.round((100 / limit) * editor.storage.characterCount.characters())
  : 0
  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

 

  return (
    <div className="editor">
      <div className="menu">
        <button
          className="menu-button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Icons.RotateLeft />
        </button>
        <button
          className="menu-button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Icons.RotateRight />
        </button>
        {/* <button
        className={classNames("menu-button", {
          "is-active": editor.isActive("link"),
        })}
        onClick={openModal}
      >
        <Icons.Link />
      </button> */}
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("bold"),
          })}
          onClick={toggleBold}
        >
          <Icons.Bold />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("underline"),
          })}
          onClick={toggleUnderline}
        >
          <Icons.Underline />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("intalic"),
          })}
          onClick={toggleItalic}
        >
          <Icons.Italic />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("strike"),
          })}
          onClick={toggleStrike}
        >
          <Icons.Strikethrough />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("code"),
          })}
          onClick={toggleCode}
        >
          <Icons.Code />
        </button>
        <Button variant="contained" onClick={addImage} sx={{mx:2}}>Add Image</Button>
      </div>
      <div>
        <input
          type="color"
          onInput={(e: any) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          value={editor.getAttributes("textStyle").color}
          data-testid="setColor"
        />
        <button
          onClick={() => editor.chain().focus().setColor("#958DF1").run()}
          className={
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "is-active"
              : ""
          }
          data-testid="setPurple"
        >
          purple
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("red").run()}
          className={
            editor.isActive("textStyle", { color: "red" }) ? "is-active" : ""
          }
          data-testid="setRed"
        >
          red
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#FBBC88").run()}
          className={
            editor.isActive("textStyle", { color: "#FBBC88" })
              ? "is-active"
              : ""
          }
          data-testid="setOrange"
        >
          orange
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#FAF594").run()}
          className={
            editor.isActive("textStyle", { color: "#FAF594" })
              ? "is-active"
              : ""
          }
          data-testid="setYellow"
        >
          yellow
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#70CFF8").run()}
          className={
            editor.isActive("textStyle", { color: "#70CFF8" })
              ? "is-active"
              : ""
          }
          data-testid="setBlue"
        >
          blue
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#94FADB").run()}
          className={
            editor.isActive("textStyle", { color: "#94FADB" })
              ? "is-active"
              : ""
          }
          data-testid="setTeal"
        >
          teal
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("green").run()}
          className={
            editor.isActive("textStyle", { color: "green" }) ? "is-active" : ""
          }
          data-testid="setGreen"
        >
          green
        </button>
        <button
          onClick={() => editor.chain().focus().unsetColor().run()}
          data-testid="unsetColor"
        >
          unsetColor
        </button>
      </div>
      {/* <div>
        <button id="add" onClick={addYoutubeVideo}>
          Add YouTube video
        </button>
        <input
          id="width"
          type="number"
          min="320"
          max="1024"
          ref={widthRef}
          placeholder="width"
        />
        <input
          id="height"
          type="number"
          min="180"
          max="720"
          ref={heightRef}
          placeholder="height"
        />
      </div> */}
      {/* <BubbleMenu
      className="bubble-menu-light"
      tippyOptions={{ duration: 150 }}
      editor={editor}
      shouldShow={({ editor, view, state, oldState, from, to }) => {
        // only show the bubble menu for links.
        return from === to && editor.isActive("link");
      }}
    >
      <button className="button" onClick={openModal}>
        Edit
      </button>
      <button className="button-remove" onClick={removeLink}>
        Remove
      </button>
    </BubbleMenu> */}
      {/* <MenuBar editor={editor}/> */}
      
      <EditorContent editor={editor} />
      
    </div>
  );
};

export default TextEditor;
