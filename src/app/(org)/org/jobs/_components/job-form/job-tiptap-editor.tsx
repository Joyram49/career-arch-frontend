'use client';

import { cn } from '@lib/utils';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface ToolbarAction {
  label: string;
  icon: string;
  isActive: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    label: 'Bold',
    icon: 'ti-bold',
    isActive: (e) => e.isActive('bold'),
    run: (e) => e.chain().focus().toggleBold().run(),
  },
  {
    label: 'Italic',
    icon: 'ti-italic',
    isActive: (e) => e.isActive('italic'),
    run: (e) => e.chain().focus().toggleItalic().run(),
  },
  {
    label: 'Underline',
    icon: 'ti-underline',
    isActive: (e) => e.isActive('underline'),
    run: (e) => e.chain().focus().toggleUnderline().run(),
  },
  {
    label: 'Heading',
    icon: 'ti-h-2',
    isActive: (e) => e.isActive('heading', { level: 2 }),
    run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: 'Subheading',
    icon: 'ti-h-3',
    isActive: (e) => e.isActive('heading', { level: 3 }),
    run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    label: 'Bullet List',
    icon: 'ti-list',
    isActive: (e) => e.isActive('bulletList'),
    run: (e) => e.chain().focus().toggleBulletList().run(),
  },
  {
    label: 'Numbered List',
    icon: 'ti-list-numbers',
    isActive: (e) => e.isActive('orderedList'),
    run: (e) => e.chain().focus().toggleOrderedList().run(),
  },
];

function ToolbarButton({
  action,
  editor,
}: {
  action: ToolbarAction;
  editor: Editor;
}): React.JSX.Element {
  const active = action.isActive(editor);
  return (
    <button
      type="button"
      onClick={() => action.run(editor)}
      aria-label={action.label}
      aria-pressed={active}
      className={cn(
        'flex size-7 items-center justify-center rounded-md text-sm transition-colors',
        active
          ? 'bg-brand-sky/15 text-brand-sky'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <i className={cn('ti', action.icon)} aria-hidden="true" />
    </button>
  );
}

function handleLink(editor: Editor): void {
  const previousUrl = editor.getAttributes('link')['href'] as string | undefined;

  const url = window.prompt('Link URL', previousUrl ?? 'https://');
  if (url === null) return;
  if (url === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }
  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing…',
  minHeight = '160px',
}: RichTextEditorProps): React.JSX.Element {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: { attributes: { class: 'tiptap-editor' } },
  });

  if (!editor) {
    return <div className="tiptap-editor animate-pulse" style={{ minHeight }} />;
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 p-1.5">
        {TOOLBAR_ACTIONS.map((action) => (
          <ToolbarButton key={action.label} action={action} editor={editor} />
        ))}
        <span className="mx-1 h-4 w-px bg-border" />
        <ToolbarButton
          action={{
            label: 'Link',
            icon: 'ti-link',
            isActive: (e) => e.isActive('link'),
            run: handleLink,
          }}
          editor={editor}
        />
      </div>
      <div style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
