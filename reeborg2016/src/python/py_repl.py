'''Reeborg Console

Copyright information at the end'''

import sys
from browser import document, window
RUR = window['RUR']

def print_exc():
    exc = __BRYTHON__.current_exception  # NOQA
    if isinstance(exc, SyntaxError):
        print('\n module %s line %s' % (exc.args[1], exc.args[2]))
        offset = exc.args[3]
        print('\n  ' + exc.args[4])
        print('\n  ' + offset * ' ' + '^')
    else:
        print(exc.info)
    print('\n' + exc.__name__)
    if exc.args:
        print(': %s' % exc.args[0])
    print('\n')


class PyConsole:
    def __init__(self):
        self.textarea = document['py-console']

    def refresh(self):
        self.textarea.value = ">>> "
        self.cursor_to_end()
        self.textarea.focus()

    def append(self, txt):
        self.textarea.value += txt

    def prompt(self):
        self.textarea.value += ">>> "

    def more(self):
        self.textarea.value += "... "

    def get_text(self):
        return self.textarea.value

    def cursor_to_end(self):
        pos = len(self.textarea.value)
        self.textarea.setSelectionRange(pos, pos)
        self.textarea.scrollTop = self.textarea.scrollHeight

    def get_col(self):
        # returns the column num of cursor
        sel = self.textarea.selectionStart
        lines = self.textarea.value.split('\n')
        for line in lines[:-1]:
            sel -= len(line) + 1
        return sel

    def selection_start(self):
        return self.textarea.selectionStart

    def set_selection_range(self, pos, col):
        self.textarea.setSelectionRange(pos, col)

    def remove_current_line(self):
        pos = self.selection_start()
        col = self.get_col()
        self.textarea.value = self.textarea.value[:pos - col + 4]

py_console = PyConsole()
sys.stdout.write = sys.stderr.write = py_console.append


def myMouseClick(event):
    py_console.cursor_to_end()


def myKeyPress(event):
    if event.keyCode == 9:  # tab key
        event.preventDefault()
        py_console.append(' ' * 4)
    elif event.keyCode == 13:  # return
        src = py_console.get_text()
        repl.set_current_line(src)
        py_console.append('\n')
        if repl.status == 'main' and not repl.current_line.strip():
            py_console.prompt()
            event.preventDefault()
            return
        repl.process_code(src)
        py_console.cursor_to_end()
        event.preventDefault()
window['myKeyPress'] = myKeyPress


def myKeyDown(event):
    if event.keyCode == 37:  # left arrow
        sel = py_console.get_col()
        if sel < 5:
            event.preventDefault()
            event.stopPropagation()
    elif event.keyCode == 36:  # line start
        pos = py_console.selection_start()
        col = py_console.get_col()
        py_console.set_selection_range(pos - col + 4, pos - col + 4)
        event.preventDefault()
    elif event.keyCode == 38:  # up
        if repl.current > 0:
            py_console.remove_current_line()
            repl.current -= 1
            py_console.append(repl.history[repl.current])
        event.preventDefault()
    elif event.keyCode == 40:  # down
        if repl.current < len(repl.history) - 1:
            py_console.remove_current_line()
            repl.current += 1
            py_console.append(repl.history[repl.current])
        event.preventDefault()
    elif event.keyCode == 8:  # backspace
        src = py_console.get_text()
        lstart = src.rfind('\n')
        if (lstart == -1 and len(src) < 5) or (len(src) - lstart < 6):
            event.preventDefault()
            event.stopPropagation()

py_console.textarea.bind('keypress', myKeyPress)
py_console.textarea.bind('keydown', myKeyDown)
py_console.textarea.bind('click', myMouseClick)


class Interpreter():

    def __init__(self):
        try:
            self.restart()
        except:
            py_console.append("Problem in attempting to (re)start Interpreter")

    def restart(self):
        py_console.refresh()
        sys.stdout.write = sys.stderr.write = py_console.append
        for item in ["editor", "editeur", "library", "biblio"]:
            if item in sys.modules:
                del sys.modules[item]
        self.status = "main"
        self.current = 0
        self.history = []
        self.current_line = ''

        self.namespace = {'__name__': 'Reeborg console'}
        try:
            lang = document.documentElement.lang
        except:
            lang = 'en'
        if lang == 'en':
            exec("from reeborg_en import *", self.namespace)
            self.namespace["done"] = self.done
        elif lang == 'fr':
            exec("from reeborg_fr import *", self.namespace)
            self.namespace["termine"] = self.done
        self.namespace["Help"] = window["Help"]
        self.namespace["init"] = window.RUR.world_init.set
        exec("__BRYTHON__.builtins.help = Help", self.namespace)
        self.run_pre()

    def run_pre(self):
        try:
            exec(RUR.CURRENT_WORLD.pre_code, self.namespace)
        except:
            pass

    def done(self):
        try:
            exec(RUR.CURRENT_WORLD.post_code, self.namespace)
        except Exception as e:
            if e.__name__ == "ReeborgError":
                raise
        RUR.rec.check_current_world_status()

    def set_current_line(self, src):
        if self.status == "main":
            self.current_line = src[src.rfind('>>>') + 4:]
        elif self.status == "multiline":
            self.current_line = src[src.rfind('>>>') + 4:]
            self.current_line = self.current_line.replace('\n... ', '\n')
        else:
            self.current_line = src[src.rfind('...') + 4:]
        if self.current_line.strip().startswith("repeat "):
            print("\n    SyntaxError: repeat is not a Python keyword", end='')
            self.current_line = ''

    def handle_syntax_error(self, msg):
        msg = str(msg)
        if (msg == 'invalid syntax : triple string end not found' or
                msg.startswith('Unbalanced bracket')):
            py_console.more()
            self.status = "multiline"
        elif msg == 'eval() argument must be an expression':
            try:
                exec(self.current_line, self.namespace)
            except:
                print_exc()
            py_console.prompt()
            self.status = "main"
        elif msg == 'decorator expects function':
            py_console.more()
            self.status = "block"
        else:
            print_exc()
            py_console.append("\n")
            py_console.prompt()
            self.status = "main"

    def process_statement(self, src):
        try:
            _ = self.namespace['_'] = eval(self.current_line, self.namespace)
            if _ is not None:
                py_console.append(repr(_) + '\n')
            py_console.prompt()
            self.status = "main"
        except IndentationError:
            py_console.more()
            self.status = "block"
        except SyntaxError as msg:
            self.handle_syntax_error(msg)
        except Exception as e:
            if e.__name__ in ['ReeborgError', 'WallCollisionError']:
                py_console.append("{}: {}".format(e.__name__,
                    RUR.translate(getattr(e, 'reeborg_shouts'))))  # NOQA
            else:
                exc = __BRYTHON__.current_exception  # NOQA
                py_console.append("{}: {}".format(e.__name__, exc.args[0]))
            py_console.append("\n")
            py_console.prompt()
            self.status = "main"

    def process_block(self, src):
        block = src[src.rfind('>>>') + 4:].splitlines()
        block = [block[0]] + [b[4:] for b in block[1:]]
        block_src = '\n'.join(block)
        # status must be set before executing code in globals()
        self.status = "main"
        try:
            _ = exec(block_src, self.namespace)
            if _ is not None:
                # if clause temporarily inserted for investigation
                if '1,$exec_' in _:
                    if hasattr(RUR, 'debug') and RUR.debug:
                        print(repr(_))
                else:
                    print(repr(_))
        except:
            print_exc()
        py_console.prompt()

    def process_code(self, src):
        self.history.append(self.current_line)
        self.current = len(self.history)
        if self.status == "main" or self.status == "multiline":
            self.process_statement(src)
        elif self.current_line == "":  # end of block
            self.process_block(src)
        else:
            py_console.more()

repl = Interpreter()
window["restart_repl"] = repl.restart
RUR.py_console_loaded = True


_copyright = """Copyright (c) 2015, André Roberge andre.roberge@gmail.com
All Rights Reserved.

Copyright (c) 2012, Pierre Quentel pierre.quentel@gmail.com
All Rights Reserved.

Copyright (c) 2001-2013 Python Software Foundation.
All Rights Reserved.

Copyright (c) 2000 BeOpen.com.
All Rights Reserved.

Copyright (c) 1995-2001 Corporation for National Research Initiatives.
All Rights Reserved.

Copyright (c) 1991-1995 Stichting Mathematisch Centrum, Amsterdam.
All Rights Reserved."""

_license = """Copyright (c) 2012, André Roberge andre.roberge@gmail.com
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer. Redistributions in binary
form must reproduce the above copyright notice, this list of conditions and
the following disclaimer in the documentation and/or other materials provided
with the distribution.
Neither the name of the <ORGANIZATION> nor the names of its contributors may
be used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
"""
