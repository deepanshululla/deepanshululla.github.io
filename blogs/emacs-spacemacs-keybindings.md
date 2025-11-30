# Emacs (spacemacs) Keybindings I use

**Published:** 2022-06-24

I recently started using Emacs for text editing purposes and was pleasantly surprised. My main goal to learn it was to work efficiently in teams that don't have a nice local dev environment and you need to have a dev machine running to run, build, and debug your code.
I started with spacemacs because it lets me merge Vim and Emacs bindings and I can choose what's easier for me to move around in the file/directory I am editing.

***Some basics first***

Understanding the basic terminology will help make the most out of Spacemacs and allow very effective use.

TerminologyDescriptionFileA file on the file systemBufferA container to display a file or other information (file navigation, REPL, data inspector, test report, etc.)WindowContains a buffer, organises multiple buffers in a frameFrameHolds one or more windows. Opening another frame gives you another instance of EmacsStatus barInformation about current window and buffer, e.g. window number, buffer mode & name, location of cursor. Also referred to as the mode line.Mini-bufferA command line for Emacs - shows commands and some results, acts as an interactive prompt for some commands

**Key bindings for spacemacs**

C → control

M→ Command (in doom)/ Option in Emacs (need to configure)

SPC→ space

S → shift

shift → shift

# Frames

commandwhat it doesC-X C-Ffind a fileC-X 2horizontal splitC-X 3vertical splitC-X ochange windowC-X 1delete other windowsC-X 0delete window

`C-u` is universal argument.

`C-U 3 C-X o` will execute `C-X o` three times

If you don’t specify a number, it takes four as default.

**`M-X`**

describe-key gives you documentation based on what a key binding does. Can also be accessed via `C-h k`

describe-function gives you documentation on what the key binding is for a given function. Can be accessed via `C-h f`

commandwhat it doesC-h kdescribe-keyC-h fC-h f

# Buffers

Everything in emacs world is a buffer. When you open a file you are essentially creating a pocket of memory to write to that emacs can use to write to disk.

commandwhat it doesC-x C-blist buffersM-x rename-bufferrenames bufferC-x kkills bufferC-x RIGHTnext bufferC-x LEFTprevious bufferC-x C-sSaves the file

# Working with files

## Replacing things

Replace occurrences of FROM-STRING with TO-STRING.

`M-x replace-string`

Similarly you can also use regexp

with `M-x replace-regexp`

It replaces things from cursor to end of buffer.

# Variations of finding files

`C-x C-f`

`/sudo::/etc/hosts` opens the /etc/hosts file with write permissions

`/ssh:user@host:/path/to/file` opens the file on remote host. Requires ssh keys to have been setup. This opens a readonly buffer. Also requires ssh keys to be already setup.

`/ssh:user@host|sudo:host:/path/to/file` opens the file on remote host. Requires ssh keys to have been setup. This opens a readonly buffer.Also requires ssh keys to be already setup.

`C-x d` search in directory

commandwhat it doesC-x C-fOpens a new buffer with content from file. Or an empty buffer with given nameC-x C-vfind alternate file. Replaces the current buffer with new fileC-x C-rreplaces current buffer with a new file(readonly mode)C-x iinsert content from another file to current bufferC-x C-sask for file name if non existent, or save existing file. For some reason not working on doom-macs

Alternatively can use vim binding like <ESC> !wq | | C-x C-w | Like save-as, ask for file name even if buffer sources an existing file | | C-x C-q | toggle read only |

`<Space> S P` lets you search for a pattern in files

`<Space> f t` toggles file tree. ? for seeing within dired file tree. Searches in all files

KeybindingsDescriptionSPC s Cclear helm-swoop own cacheSPC s sexecute helm-swoop (search within same file)SPC s Sexecute helm-multi-swoopSPC s C-sexecute helm-multi-swoop-allSPC s psearch project

## Dired mode

If you do `C-x C-f` on a directory you will

you don’t need to press control, just type `D` to delete a file.

(d) Staged for deletion

(x) Delete staged entries

(u) undo stages

(a) after activation open files or directory in current buffer

(R) rename. note this is Capital R.

(C) copy the current file(you don’t have to press x. Also works on directories)

(!) execute command. You can execute command on particular file/directory, whatever command you type here gets executed on that file/directory

(+) create directory

## Move around in file

commandwhat it doesC-emove to end of line. <ESC> ^ vim binding.C-arenames buffer. <ESC> $ vim binding.M - < (requires shift)move to start of buffer. In vim it is ESC ggM - > (requires shift)move to end of buffer. In vim it is ESC gC-x LEFTprevious bufferC-sIsearch-forward the file and find next reference . You can use C-u C-s to do a regexp search over whole documentC-u 13 <down arrow>moves the arrow 13 lines downC-u 13 <up arrow>moves the arrow 13 lines upC-<space> C-<space>saves your cursor positionC-u C-<space>go back to save position

## Selecting, Copy paste and delete

commandwhat it doesC-<space>Set mark command. You can do in Vim by doing <ESC> v> to go to visual mode and then do select, copy and paste from there.C-wkill-region. Cut/DeleteAdditonal notes since in spacemacs <option> is configured as meta key, <Command-C> can copy and <Command-V> can pasteC-kdelete/cut line. In vim done by yyM - wkill-ring-save. CopyC-ypasteC-x LEFTprevious bufferM-yreplace with previous entry in kill ring.C-x u or C-<shift>-<underscore>undoM-<shift>-<underscore>redoC-<delete>backward-kill-word Deletes the last word.

### additional notes about vim

KeyActionycopy (yank) selection and add to kill ringxdelete character at point and add to kill ringXdelete character before point and add to kill ringppaste (put)uundoCtrl-rredo

**Copying (Yanking)**

- `yy` - Yank (copy) the current line, including the newline character.- `3yy` - Yank (copy) three lines, starting from the line where the cursor is positioned.- `y$` - Yank (copy) everything from the cursor to the end of the line.- `y^` - Yank (copy) everything from the cursor to the start of the line.- `yw` - Yank (copy) to the start of the next word.- `yiw` – Yank (copy) the current word.- `y%` - Yank (copy) to the matching character. By default supported pairs are `()`, `{}`, and `[]`. Useful to copy text between matching brackets.

**Cutting (Deleting)**

- `dd` - Delete (cut) the current line, including the newline character.- `3dd` - Delete (cut) three lines, starting from the line where the cursor is positioned,- `d$` - Delete (cut) everything from the cursor to the end of the line.

**Pasting (Putting)**

To put the yanked or deleted text, move the cursor to the desired location and press `p` to put (paste) the text after the cursor or `P` to put (paste) before the cursor.

# Look up man pages

`M-x man` <enter> will give you a prompt to search for the correct man page. this is just a read write text buffer.

`C-h` shows emacs help menu

`b` would show the key bindings available.

# Terminal Emulator

## Shell

`M-x shell` not a full fledged emulator. Emacs is acting as a dumb shell here. It is a text buffer so you can read, delete file from this.

`M-p` for going over history of shell

you can even save this shell output `<C-X> <C-s>` in a file.

## terminal

for running a full terminal, use `M-x term` <Enter>

you can run zsh from this

## eshell

it is emacs shell. this is not zsh.

The nice thing with eshell we can do is redirect out put of some commands to some buffer.