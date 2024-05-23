import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

const handleFormatting = (content, textareaRef, formatter) => {
  const textarea = textareaRef.current;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = content.slice(start, end);
  const formattedText = formatter(selectedText);
  const newContent = `${content.slice(0, start)}${formattedText}${content.slice(end)}`;

  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(start, end);
  }, 0);

  return newContent;
};

const handleBold = (content, textareaRef) => {
  return handleFormatting(content, textareaRef, (text) => `**${text}**`);
};

const handleItalics = (content, textareaRef) => {
  return handleFormatting(content, textareaRef, (text) => `*${text}*`);
};

const handleInlineCodeBlock = (content, textareaRef) => {
  return handleFormatting(content, textareaRef, (text) => `\`${text}\``);
};

const handleLinePrefix = (content, textareaRef, prefix) => {
  const textarea = textareaRef.current;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const startOfLine = value.lastIndexOf("\n", start - 1) + 1;
  const endOfLine = value.indexOf("\n", end);
  const currentLine = value.slice(
    startOfLine,
    endOfLine !== -1 ? endOfLine : value.length,
  );
  const newContent =
    value.slice(0, startOfLine) +
    prefix +
    currentLine +
    value.slice(endOfLine !== -1 ? endOfLine : value.length);

  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length, end + prefix.length);
  }, 0);

  return newContent;
};

const handleBlockQuote = (content, textareaRef) => {
  return handleLinePrefix(content, textareaRef, "> ");
};

const handleHeadingOne = (content, textareaRef) => {
  return handleLinePrefix(content, textareaRef, "# ");
};

const handleHeadingTwo = (content, textareaRef) => {
  return handleLinePrefix(content, textareaRef, "## ");
};

const handleHeadingThree = (content, textareaRef) => {
  return handleLinePrefix(content, textareaRef, "### ");
};

const handleBulletPoint = (content, textareaRef) => {
  return handleLinePrefix(content, textareaRef, "- ");
};

const handleNumberedList = (content, textareaRef) => {
  return handleLinePrefix(content, textareaRef, "1. ");
};

const EditMenuBarMenu = ({ content, textareaRef, onContentChange }) => {
  const handleEditAction = (actionFn) => {
    const newContent = actionFn(content, textareaRef);
    onContentChange(newContent);
  };
  return (
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onSelect={() => handleEditAction(handleBold)}>
          Bold <MenubarShortcut>⌘B</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleEditAction(handleItalics)}>
          Italics <MenubarShortcut>⌘I</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleEditAction(handleInlineCodeBlock)}>
          Code <MenubarShortcut>⇧⌘C</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleEditAction(handleBlockQuote)}>
          Blockquote
        </MenubarItem>
        <MenubarItem onSelect={() => handleEditAction(handleBulletPoint)}>
          Bullet Point
        </MenubarItem>
        <MenubarItem onSelect={() => handleEditAction(handleNumberedList)}>
          List
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onSelect={() => handleEditAction(handleHeadingOne)}>
          Heading 1 <MenubarShortcut>⌘H1</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleEditAction(handleHeadingTwo)}>
          Heading 2 <MenubarShortcut>⌘H2</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleEditAction(handleHeadingThree)}>
          Heading 3 <MenubarShortcut>⌘H3</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};

export default EditMenuBarMenu;
