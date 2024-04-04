'use client'

import { ContentMatch } from '@tiptap/pm/model'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<h2>Enter your name: </h2>',
  })
  console.log('content', StarterKit)
  console.log('content', editor)
  console.log('type', typeof editor)

  return (
    <EditorContent editor={editor} />
  )
}

export default Tiptap;