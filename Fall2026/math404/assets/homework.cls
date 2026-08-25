\NeedsTeXFormat{LaTeX2e} 
\ProvidesClass{homework651}[2017/01/26]

\newif\ifusingminion \usingminionfalse
\DeclareOption{minion}{\usingminiontrue}

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions\relax
\LoadClass[12pt]{article} 

\RequirePackage{amssymb,amsmath,amsthm}
\RequirePackage[top=1in, bottom=1in, left=1.25in, right=1.25in]{geometry}

% ---------------------------------------------------------------------
%% Font cascade: MinionPro (opt-in) -> newtx -> CM.
%% Each stage falls through if the package isn't installed, so the class
%% still compiles on a machine that isn't mine.
%% ---------------------------------------------------------------------
\RequirePackage[T1]{fontenc}
\newif\ifhw@fontset \hw@fontsetfalse

\ifusingminion
  \IfFileExists{MinionPro.sty}{%
    \RequirePackage[lf]{MinionPro}%
    %% MinionPro leaves \mathdollar in a state amsmath objects to.
    \let\mathdollar\undefined
    \hw@fontsettrue
  }{%
    \ClassWarningNoLine{homework}{Option `minion' requested but
      MinionPro.sty was not found; falling back}%
  }%
\fi

\ifhw@fontset\else
  \IfFileExists{libertinus.sty}{\IfFileExists{libertinust1math.sty}{%
    \RequirePackage{libertinus}%
    \RequirePackage{libertinust1math}%
    \hw@fontsettrue
  }{}}{}%
\fi


\ifhw@fontset\else
  \IfFileExists{newtxtext.sty}{\IfFileExists{newtxmath.sty}{%
    \RequirePackage{newtxtext}%
    \RequirePackage{newtxmath}%
    \hw@fontsettrue
  }{}}{}%
\fi

\ifhw@fontset\else
  \ClassWarningNoLine{homework}{Package libertinus or newtx not found;
    falling back to Computer Modern}%
\fi

\RequirePackage{microtype}

\RequirePackage[skip=6pt plus 1pt minus 1pt, indent=0pt, parfill]{parskip}

\newtheorem*{theoremcore}{Theorem \@currentlabel}
\newenvironment{theorem}[1]
{\def\@currentlabel{#1}\theoremcore}
{\endtheoremcore}

\newtheorem*{propcore}{Proposition \@currentlabel}
\newenvironment{proposition}[1]
{\def\@currentlabel{#1}\propcore}
{\endpropcore}

\newtheorem*{lemmacore}{Lemma \@currentlabel}
\newenvironment{lemma}[1]
{\def\@currentlabel{#1}\lemmacore}
{\endlemmacore}

\newtheorem*{corollarycore}{Corollary \@currentlabel}
\newenvironment{corollary}[1]
{\def\@currentlabel{#1}\corollarycore}
{\endcorollarycore}

\RequirePackage{fancyhdr}
\pagestyle{fancy}
\fancyfoot[C]{\ifnum \value{page} > 1\relax\thepage\fi}
\fancyhead[L]{\@doclabel}
\fancyhead[C]{\ifx\@docauthor\@empty\else\@docdate\fi}
\fancyhead[R]{\ifx\@docauthor\@empty\@docdate\else\@docauthor\fi}
\headheight 15pt


\def\doclabel#1{\gdef\@doclabel{#1}}
\doclabel{Use {\tt\textbackslash doclabel\{MY LABEL\}}.}
\def\docdate#1{\gdef\@docdate{#1}}
\docdate{Use {\tt\textbackslash docdate\{MY DATE\}}.}
\def\docauthor#1{\gdef\@docauthor{#1}}
%\docauthor{Use {\tt\textbackslash docauthor\{MY NAME\}}.}
\let\@docauthor\@empty

\newcounter{probcount}
\newcounter{subprobcount}
\newlength\probsep
\newlength\pshrinking
\newif\iffirstprob


\RequirePackage{enumitem}
\newlist{problems}{enumerate}{1}
\setlist[problems]{%
  label=\textbf{\arabic*.},
  ref=\arabic*,
  leftmargin=*, widest=9,
  topsep=\parskip, itemsep=\parskip, parsep=\parskip,
  listparindent=\z@}
\newcommand{\problem}{\setcounter{subprobcount}{0}\item}

\newlist{subproblems}{enumerate}{2}
\setlist[subproblems]{label=\alph*), nosep, labelindent=1.5em, leftmargin=*}

%% The localhead command puts a tightly bound label on top of a paragraph -- handy for labels
%% like "Solution:"
\newcommand{\localhead}[1]{\par\smallskip\textbf{#1}\nobreak\\}%
\newcommand\solution{\localhead{Solution:}}
\newcommand\subsol{\stepcounter{subprobcount}\localhead{Solution, part \alph{subprobcount}:}}
\newcommand\subsoleg[1]{\stepcounter{subprobcount}\par\textbf{Solution, part \alph{subprobcount}:} #1\\}
\def\solver#1{(Solution by #1)\par}

%% The default 'article' class has captions that label figures Figure 1, etc.  This is too 
%% formal for homework sets, so we change \caption so that it just puts the caption text.
%% Here I have just modified the \@makecaption command from the article class.
%% Maybe I should change this in the future to let authors decide whether or not to label a figure.

\long\def\@makecaption#1#2{%
  \vskip\abovecaptionskip
  \sbox\@tempboxa{#2}%
  \ifdim \wd\@tempboxa >\hsize
    #2\par
  \else
    \global \@minipagefalse
    \hb@xt@\hsize{\hfil\box\@tempboxa\hfil}%
  \fi
  \vskip\belowcaptionskip}

%% The default implementation of the proof environment starts a new paragraph at the start of the proof,
%% with the full parskip spacing. This only looks good following a theorem statement 
%% if \parskip is set to zero.  We've got a medium sized parskip, so we overide this 
%% questionable decision.
\renewenvironment{proof}[1][\proofname]{\par
  \pushQED{\qed}%
  \normalfont \topsep6\p@\@plus6\p@\relax
  \trivlist
  \@topsep \topsep
  \item[\hskip\labelsep
        \itshape
    #1\@addpunct{.}]\ignorespaces
}{%
  \popQED\endtrivlist\@endpefalse
}

