"""Build the scalable dormitory illustrations from original vector shapes.

Usage: python tools/generate_cinema_icons.py
"""
from pathlib import Path
from textwrap import dedent

PALETTES = {
    "blue": ("#c9f2ff", "#4995e4", "#174ab5", "#102755"),
    "red": ("#ffc1ae", "#f44e62", "#be1736", "#551635"),
    "green": ("#c1f3ce", "#44c58e", "#127b60", "#124a45"),
    "gold": ("#fff0b6", "#f5b958", "#c47622", "#70421e"),
    "gray": ("#e7effd", "#98aac4", "#536981", "#283b56"),
}

CORAL = "url(#red)"


def ground():
    return '<ellipse cx="64" cy="108" rx="48" ry="13" fill="url(#shadow)"/>'


def badge(mark, color="url(#face)", x=64, y=60, scale=1.75):
    marks = {
        "check": '<path d="m-9 0 6 6 12-13" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
        "clock": '<path d="M0-9v10l6 4" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>',
        "alert": '<path d="M0-9v10" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cy="8" r="2.3" fill="#fff"/>',
        "minus": '<path d="M-8 0H8" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
    }
    return (
        f'<g transform="translate({x} {y}) scale({scale})">'
        '<circle cy="3" r="18" fill="#102755" opacity=".29"/>'
        f'<circle r="17.5" fill="{color}" stroke="#fff8e7" stroke-width="1.6"/>'
        '<path d="M-13-7a15 15 0 0 1 21-6" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".65"/>'
        f'{marks[mark]}</g>'
    )


def building():
    windows = "\n".join(
        f'<path d="M{x} {y}l10 2.4v10l-10-2.4z" fill="url(#glass)"/>'
        for x, y in [(31, 42), (49, 46), (67, 50), (31, 58), (49, 62), (67, 66), (31, 74), (67, 82)]
    )
    return f"""
      <path d="m19 89 62 15 29-16 4 6-31 18-68-17z" fill="#172b59" opacity=".24"/>
      <path d="M21 31 79 44v59L21 89z" fill="url(#paper)" stroke="#9dbce0" stroke-width="1.4"/>
      <path d="m79 44 27-16v59l-27 16z" fill="url(#rim)" stroke="#0e2250" stroke-width="1.4"/>
      <path d="m19 30 28-18 62 14-30 19z" fill="url(#red)" stroke="#ad2948" stroke-width="1.2"/>
      <path d="m26 31 23-14 52 11-23 14z" fill="#fff4e1" opacity=".48"/>
      {windows}
      <path d="m47 83 14 3.5v13l-14-3.5z" fill="url(#glass)"/>
      <path d="m85 49 14-8v10l-14 8zm0 16 14-8v10l-14 8zm0 16 14-8v10l-14 8z" fill="#c8e9ff" opacity=".89"/>
      <path d="m25 88 52 13" stroke="#fff" opacity=".55" stroke-width="1.5"/>
    """


def bed():
    return """
      <path d="m19 66 36-19 54 25v13L73 105 19 80z" fill="url(#rim)" stroke="#132653" stroke-width="1.3"/>
      <path d="m73 92 36-20v13l-36 20z" fill="url(#face)"/>
      <path d="M17 65V43q0-4 4-6l34-18q5-2 5 4v27L21 72z" fill="url(#rim)" stroke="#132653" stroke-width="1.7"/>
      <path d="m21 42 34-18v21L21 63z" fill="url(#face)"/>
      <path d="m20 64 37-20 50 23q5 3 1 7L73 94 21 70q-4-3-1-6Z" fill="url(#paper)" stroke="#7b9bbc" stroke-width="1.2"/>
      <path d="m43 74 38-22 26 15q5 3 1 7L73 94z" fill="url(#face)" stroke="#264879" stroke-width="1.25"/>
      <path d="m44 74 38-21m-5 35 30-17" stroke="#fff" opacity=".6" stroke-width="2.2" stroke-linecap="round"/>
      <path d="m25 60 20-11q3-2 6 0l15 7q2 1 0 3L45 71q-2 1-6-1l-13-6q-4-2-1-4Z" fill="#fdfaff" stroke="#8eb0d7" stroke-width="1.4"/>
      <path d="M24 81v8m45 14v7m36-24v7" stroke="#192c53" stroke-width="4.7" stroke-linecap="round"/>
    """


def door():
    return """
      <path d="m25 49 39-32 40 22v60l-39 14-40-19z" fill="url(#rim)" stroke="#152f5d" stroke-width="2.2"/>
      <path d="m26 51 37-33v94L26 93z" fill="url(#paper)"/>
      <path d="m64 18 39 22v58l-39 14z" fill="url(#face)"/>
      <path d="m53 60 28-17v54l-28 8z" fill="#12254e"/>
      <path d="m53 61 20 7v35l-20 2z" fill="url(#gold)" stroke="#80512a" stroke-width="1.4"/>
      <path d="m19 98 45 18 47-16" fill="none" stroke="#647fad" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="67" cy="86" r="2.6" fill="#fff5cf"/>
      <path d="m28 50 35-29 37 21" fill="none" stroke="#f1f7ff" stroke-width="2.4" opacity=".78"/>
    """


def document(style="file"):
    if style == "clipboard":
        return """
          <rect x="29" y="25" width="67" height="82" rx="10" fill="url(#rim)" stroke="#1e3761" stroke-width="1.3"/>
          <rect x="25" y="21" width="66" height="82" rx="9" fill="url(#face)"/>
          <rect x="32" y="32" width="52" height="64" rx="4" fill="url(#paper)"/>
          <path d="M48 26v-4a5 5 0 0 1 5-5h3a6 6 0 0 1 12 0h3a5 5 0 0 1 5 5v4z" fill="url(#gold)" stroke="#9f682f" stroke-width="1.2"/>
          <path d="M43 50h29M43 63h23M43 76h19" stroke="#26538a" stroke-width="4.5" stroke-linecap="round"/>
          <path d="m82 92 20-39 10 5-20 39-12 8z" fill="url(#red)" stroke="#8e2740" stroke-width="1.3"/>
          <path d="m102 53 3-7q2-4 6-2l3 2q3 2 1 5l-3 7z" fill="#ffe4bc"/>
        """
    decoration = ""
    if style == "invoice":
        decoration = """
          <circle cx="93" cy="83" r="21" fill="#804a25" stroke="#fff6e3" stroke-width="2"/>
          <circle cx="90" cy="79" r="20" fill="url(#gold)" stroke="#fff6e3" stroke-width="2"/>
          <circle cx="90" cy="79" r="14" fill="none" stroke="#976224" stroke-width="2"/>
          <path d="m90 69 8 10-8 10-8-10z" fill="#fff0b0"/>
        """
    elif style == "pen":
        decoration = """
          <path d="m72 97 26-53 12 6-25 53-16 8z" fill="url(#red)" stroke="#9d2540" stroke-width="1.7"/>
          <path d="m98 44 4-8q2-4 6-2l5 2q4 2 2 6l-5 8z" fill="url(#gold)"/>
          <path d="m72 97 13 6-16 8z" fill="#f6d08b"/>
        """
    return f"""
      <path d="M37 17h37l19 20v56q0 9-8 9H36q-9 0-9-9V27q0-10 10-10Z" fill="url(#rim)" transform="translate(6 6)"/>
      <path d="M37 17h37l19 20v56q0 9-8 9H36q-9 0-9-9V27q0-10 10-10Z" fill="url(#paper)" stroke="#7498c4" stroke-width="2"/>
      <path d="M74 17v13q0 7 7 7h12z" fill="url(#face)"/>
      <path d="M41 45h23M41 57h35M41 69h29M41 81h18" fill="none" stroke="#275482" stroke-width="4.8" stroke-linecap="round"/>
      <path d="M34 32v-5q0-4 4-4h29" fill="none" stroke="white" stroke-width="2.4" opacity=".9" stroke-linecap="round"/>
      {decoration}
    """


def wrench():
    shape = "M96 17C83 16 73 24 71 37c-1 5 0 9 2 13L24 93q-6 6 0 13l4 4q5 5 11-1l48-48c13 4 29-6 30-20l-1-11-15 13-12-5-1-10 14-11z"
    return f"""
      <path d="{shape}" fill="url(#rim)" transform="translate(1 5)"/>
      <path d="{shape}" fill="url(#face)" stroke="#192e56" stroke-width="1.7" stroke-linejoin="round"/>
      <path d="m31 94 44-39" stroke="#fff2db" stroke-width="3.5" stroke-linecap="round" opacity=".62"/>
      <path d="M76 38c2-9 7-15 16-17" fill="none" stroke="#fff" stroke-width="2.8" opacity=".7" stroke-linecap="round"/>
      <circle cx="33" cy="101" r="5" fill="#13305c"/>
      <path d="m42 23 4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="url(#gold)" stroke="#c98230" stroke-width="1.1"/>
    """


def people():
    return """
      <path d="M62 93v-6c0-17 12-29 26-29 15 0 27 11 27 27v11l-20 11z" fill="url(#rim)"/>
      <path d="M60 91v-6c0-15 12-26 27-26 14 0 24 10 24 25v7l-24 11z" fill="url(#red)"/>
      <circle cx="87" cy="41" r="18" fill="url(#gold)" stroke="#ad622f" stroke-width="1.2"/>
      <path d="M70 39a17 17 0 1 1 34-4c-9 3-16-1-19-6-5 5-9 7-15 10Z" fill="#173360"/>
      <path d="M14 93v-7c0-19 16-32 35-32s34 13 34 31v12l-33 14z" fill="url(#rim)"/>
      <path d="M13 89v-6c0-16 16-29 35-29 17 0 31 12 31 27v12l-31 13z" fill="url(#face)"/>
      <circle cx="48" cy="36" r="22" fill="url(#gold)" stroke="#ad622f" stroke-width="1.3"/>
      <path d="M27 35a22 22 0 1 1 43-7c-6 2-12 1-21-5-3 6-12 10-22 12Z" fill="#132d57"/>
      <path d="m34 63 14 13 14-13M23 77c3-5 7-8 10-10" fill="none" stroke="#fff6e9" stroke-width="3.5" opacity=".8" stroke-linecap="round" stroke-linejoin="round"/>
    """


def desk():
    return """
      <path d="M22 69v33l7 4V74m57 6v26l7-4V75m13-14v32l6-3V59" fill="url(#rim)" stroke="#1d325b" stroke-width="2" stroke-linejoin="round"/>
      <path d="m14 64 29-18 72 10-30 24z" fill="url(#paper)" stroke="#a6c2e2" stroke-width="1.6"/>
      <path d="m14 64 71 16v10L14 74z" fill="url(#face)" stroke="#193969" stroke-width="1.2"/>
      <path d="m85 80 30-24v10L85 90z" fill="url(#rim)"/>
      <path d="m29 58 19-11 30 6-18 12z" fill="url(#red)" stroke="#c52e46" stroke-width="1.1"/>
      <path d="m32 57 17-9 25 5-16 9z" fill="#fff1d8"/>
      <path d="m81 54 11 2m-3-2 7-15-9-16" stroke="#18467c" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M89 22c-8-8-16-5-21 2l15 10z" fill="url(#gold)" stroke="#a96926" stroke-width="1.5"/>
    """


def wardrobe():
    return """
      <path d="m27 34 25-17 59 13-24 16z" fill="url(#paper)" stroke="#c19a69" stroke-width="1.4"/>
      <path d="m87 46 24-16v60l-24 16z" fill="url(#rim)" stroke="#543919" stroke-width="1.6"/>
      <path d="m27 34 60 12v60L27 94z" fill="url(#face)" stroke="#684f37" stroke-width="1.6"/>
      <path d="m32 42 23 5v48l-23-5zm29 6 21 5v47l-21-4z" fill="#fff3c9" opacity=".72"/>
      <path d="M55 70v9m9-7v9" stroke="#17366a" stroke-width="3.7" stroke-linecap="round"/>
      <path d="m32 42 49 11" fill="none" stroke="#fff7de" stroke-width="2.2" opacity=".8"/>
    """


def washroom():
    return """
      <path d="M90 99V32c0-12-17-16-22-6l-4 9" fill="none" stroke="url(#rim)" stroke-width="8" stroke-linecap="round"/>
      <path d="M63 33q10 2 14 11l-21 2q-1-8 7-13Z" fill="url(#gold)" stroke="#9c6f32" stroke-width="1.3"/>
      <path d="m60 52-2 7m11-7-1 8m10-8v6" stroke="#3f86cb" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M29 54h16v28H29q-6 0-6-6V61q0-7 6-7Z" fill="url(#face)" stroke="#1b417a" stroke-width="1.5"/>
      <path d="M31 78h38q1 14-14 20l2 9H35l4-13q-8-5-8-16Z" fill="url(#paper)" stroke="#356391" stroke-width="2"/>
      <ellipse cx="51" cy="78" rx="20" ry="6" fill="url(#glass)" stroke="#5a84b1" stroke-width="1.4"/>
    """


def wifi():
    return """
      <path d="m20 84 22-14 68 12-23 15z" fill="url(#paper)" stroke="#8fb0cf" stroke-width="1.6"/>
      <path d="m20 84 67 13v9L20 93z" fill="url(#face)"/>
      <path d="m87 97 23-15v9l-23 15z" fill="url(#rim)"/>
      <path d="M33 45q31-30 62 0m-53 11q22-22 44 0M52 66q12-12 24 0" fill="none" stroke="url(#rim)" stroke-width="8.8" stroke-linecap="round" transform="translate(1 3)"/>
      <path d="M33 45q31-30 62 0m-53 11q22-22 44 0M52 66q12-12 24 0" fill="none" stroke="url(#face)" stroke-width="8.2" stroke-linecap="round"/>
      <circle cx="64" cy="76" r="5.2" fill="url(#red)"/>
      <path d="M75 96v3m6-2v3" stroke="#fff3cf" stroke-width="2.5" stroke-linecap="round"/>
    """


def cap():
    return """
      <path d="M36 55v29q8 13 27 17 20-4 30-17V55Z" fill="url(#rim)" stroke="#102953" stroke-width="1.6"/>
      <path d="m15 52 49-26 50 24-50 25z" fill="url(#face)" stroke="#184773" stroke-width="1.8"/>
      <path d="m15 52 49 23 50-25v7L64 83 15 59z" fill="url(#rim)"/>
      <path d="m25 51 39-21 40 19" fill="none" stroke="#e8f4ff" stroke-width="2.5" opacity=".74"/>
      <path d="m64 50 35 17v18" fill="none" stroke="#ffcc76" stroke-width="3.6" stroke-linecap="round"/>
      <path d="m99 84-5 12h10z" fill="url(#gold)" stroke="#a56d29" stroke-width="1.2"/>
    """


def megaphone():
    return """
      <path d="m53 75 10 27q3 7-4 9l-9-3-10-29z" fill="url(#rim)" stroke="#162d52" stroke-width="1.5"/>
      <path d="m40 52 43-27 7 69-48-16z" fill="url(#face)" stroke="#852841" stroke-width="1.5"/>
      <path d="m42 53 37-23 2 14-37 16z" fill="#fff4da" opacity=".55"/>
      <ellipse cx="86" cy="59" rx="14" ry="36" transform="rotate(-7 86 59)" fill="url(#paper)" stroke="#8b2e45" stroke-width="2"/>
      <ellipse cx="87" cy="59" rx="8" ry="25" transform="rotate(-7 87 59)" fill="url(#rim)"/>
      <path d="m24 54 18-3 5 28-18 3q-10-1-12-10l-1-7q-2-8 8-11Z" fill="url(#blue)" stroke="#173a6c" stroke-width="1.3"/>
      <path d="m106 40 9-7m-7 24 12-1m-12 19 10 5" fill="none" stroke="#f2a047" stroke-width="4" stroke-linecap="round"/>
    """


def shieldmail():
    return """
      <path d="M20 34c19-3 32-9 44-20 12 11 25 17 45 20v25q0 31-45 54-44-23-44-54Z" fill="url(#rim)" transform="translate(3 4)"/>
      <path d="M20 34c19-3 32-9 44-20 12 11 25 17 45 20v25q0 31-45 54-44-23-44-54Z" fill="url(#face)" stroke="#fcf3d9" stroke-width="3"/>
      <path d="M64 19c13 10 24 15 41 18v21q0 28-41 50z" fill="#0c285d" opacity=".36"/>
      <path d="m34 54 60-4 3 34-60 4z" fill="url(#paper)" stroke="#173969" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="m34 54 32 21 28-25z" fill="url(#red)" stroke="#a02644" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="m38 85 19-16m20-1 17 14" stroke="#4d6d99" stroke-width="1.6"/>
    """


def bank():
    return """
      <path d="m18 83 72 9 20-12v9l-20 14-72-10z" fill="url(#rim)"/>
      <path d="m18 83 18-10 74 7-20 12z" fill="url(#paper)" stroke="#7a9ec6" stroke-width="1.3"/>
      <path d="m29 53 11 1v26l-11-2zm20 2 11 1v26l-11-1zm20 3 11 1v25l-11-1z" fill="url(#face)" stroke="#3065a0" stroke-width="1.5"/>
      <path d="m20 51 33-28 41 28-10 13-64-9z" fill="url(#paper)" stroke="#537aa9" stroke-width="1.5"/>
      <path d="m20 51 33-28 41 28-10 5z" fill="url(#face)" stroke="#386499" stroke-width="1.2"/>
      <path d="m22 50 32-25 49 10-9 16-41-28" fill="url(#gold)" stroke="#b57a35" stroke-width="1.3"/>
      <path d="m94 51 9-16v45l-9 8z" fill="url(#rim)"/>
      <circle cx="56" cy="47" r="5" fill="#fff3cb"/>
    """


def counter():
    return """
      <path d="M22 73c0-14 11-25 24-25s23 11 23 25v7H22z" fill="url(#face)" stroke="#12345f" stroke-width="1.6"/>
      <circle cx="46" cy="32" r="18" fill="url(#gold)" stroke="#a77535" stroke-width="1.2"/>
      <path d="M28 31a18 18 0 0 1 36-1c-8-1-13-4-16-10-6 7-12 10-20 11z" fill="#182f55"/>
      <path d="m75 50 30 2v23l-30-3z" fill="url(#rim)" stroke="#153157" stroke-width="1.6"/>
      <path d="m80 54 20 2v13l-20-1z" fill="url(#glass)"/>
      <path d="M91 74v8m-9 0 18 1" stroke="#152f5e" stroke-width="3.4" stroke-linecap="round"/>
      <path d="m13 80 16-9 87 12-14 9-89-9z" fill="url(#paper)" stroke="#7d9fc8" stroke-width="1.5"/>
      <path d="m13 83 89 9v13l-89-9z" fill="url(#face)"/>
      <path d="m102 92 14-9v13l-14 9z" fill="url(#rim)"/>
    """


def wallet():
    return """
      <path d="m31 44 49-25 13 20-50 23z" fill="url(#gold)" stroke="#b68445" stroke-width="1.5"/>
      <path d="m40 42 41-18 4 6-42 17z" fill="#fff6d8" opacity=".78"/>
      <path d="m17 57 16-15 71 9 9 14-11 31-78-5z" fill="url(#rim)" stroke="#243359" stroke-width="1.5"/>
      <path d="M17 56q0-6 8-6l71 11q9 2 9 11v21q0 10-10 9L26 91q-9-1-9-9Z" fill="url(#face)" stroke="#22365d" stroke-width="1.7"/>
      <path d="m23 58 72 11" fill="none" stroke="#fff2de" stroke-width="2.3" opacity=".72" stroke-linecap="round"/>
      <path d="m104 71 9-2v16l-11 4-23-3q-6-1-6-8t6-8Z" fill="url(#red)" stroke="#912840" stroke-width="1.4"/>
      <circle cx="84" cy="78" r="3.4" fill="#fff3cf"/>
    """


def calendar():
    return """
      <rect x="31" y="24" width="70" height="74" rx="10" fill="url(#rim)"/>
      <rect x="24" y="20" width="72" height="73" rx="9" fill="url(#paper)" stroke="#5a83ae" stroke-width="1.8"/>
      <path d="M24 39V30q0-10 10-10h52q10 0 10 10v9Z" fill="url(#face)"/>
      <path d="M42 15v15m35-15v15" stroke="#132f60" stroke-width="6" stroke-linecap="round"/>
      <path d="M40 52h9m9 0h9m9 0h8M40 65h9m9 0h9m-27 13h9m9 0h9" stroke="#5089c3" stroke-width="5.7" stroke-linecap="round"/>
    """ + badge("clock", CORAL, x=90, y=88, scale=1.19)


def feedback():
    return """
      <path d="M58 57h44q9 0 9 9v24q0 9-9 9h-4v12L84 99H58q-9 0-9-9V66q0-9 9-9Z" fill="url(#rim)" transform="translate(2 3)"/>
      <path d="M58 57h44q9 0 9 9v24q0 9-9 9h-4v12L84 99H58q-9 0-9-9V66q0-9 9-9Z" fill="url(#blue)" stroke="#1f4891" stroke-width="1.3"/>
      <path d="M26 22h53q10 0 10 10v28q0 10-10 10H44L24 83V70q-9-2-9-11V32q0-10 11-10Z" fill="url(#rim)" transform="translate(3 4)"/>
      <path d="M26 22h53q10 0 10 10v28q0 10-10 10H44L24 83V70q-9-2-9-11V32q0-10 11-10Z" fill="url(#face)" stroke="#a12945" stroke-width="1.5"/>
      <path d="M29 39h42M29 51h31" stroke="#fff6e1" stroke-width="4.7" stroke-linecap="round"/>
      <path d="M71 82h1m10 0h1m10 0h1" stroke="#edf9ff" stroke-width="4.8" stroke-linecap="round"/>
    """


def transfer():
    return """
      <g transform="translate(-1 27) scale(.58)">""" + bed() + """</g>
      <g transform="translate(54 27) scale(.58)">""" + bed() + """</g>
      <path d="M32 40q14-24 42-18" fill="none" stroke="#9e2341" stroke-width="7.2" stroke-linecap="round" transform="translate(0 2)"/>
      <path d="M32 40q14-24 42-18m-9-12 12 13-15 7" fill="none" stroke="#fb6172" stroke-width="6.3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M95 91q-14 24-42 18m9 12-12-13 15-7" fill="none" stroke="#db3352" stroke-width="6.3" stroke-linecap="round" stroke-linejoin="round"/>
    """


def bulb():
    return """
      <path d="M38 60a27 27 0 1 1 51-12c0 11-7 17-11 23l-4 12H53l-4-12Z" fill="url(#rim)" transform="translate(3 2)"/>
      <path d="M38 60a27 27 0 1 1 51-12c0 11-7 17-11 23l-4 12H53l-4-12Z" fill="url(#gold)" stroke="#b98035" stroke-width="1.8"/>
      <path d="M46 47q1-11 13-16" fill="none" stroke="#fff6d0" stroke-width="5" stroke-linecap="round"/>
      <path d="m63 81-7-22h15l-7 22" fill="none" stroke="#9e571f" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M51 81h26v10q0 6-8 7l-5 5-5-5q-8-1-8-7Z" fill="url(#blue)" stroke="#1d3a6d" stroke-width="1.5"/>
      <path d="M53 87h22m-19 5h16" stroke="#d4f4ff" stroke-width="2.1" stroke-linecap="round"/>
      <path d="m19 51 11-1m-4-22 9 5m65 0 9-6m-8 24 11 1" stroke="#e69a42" stroke-width="3.7" stroke-linecap="round"/>
    """


def faucet():
    return """
      <path d="M19 90 53 77l48 9-33 14Z" fill="url(#paper)" stroke="#91afd0" stroke-width="1.6"/>
      <path d="m19 90 49 10v9l-49-10zm49 10 33-14v9l-33 14z" fill="url(#rim)"/>
      <path d="M40 90V54c0-16 10-23 25-23h18c13 0 20 9 20 23v9H86V51q0-4-5-4H65q-8 0-8 8v38z" fill="url(#face)" stroke="#214f82" stroke-width="1.7"/>
      <path d="M43 71V54c0-12 7-19 20-20h17" fill="none" stroke="#f2f8fe" stroke-width="3.7" stroke-linecap="round" opacity=".77"/>
      <path d="M49 36V23m-12 0h25" stroke="#183e76" stroke-width="5.8" stroke-linecap="round"/>
      <path d="M95 68c6 8 8 12 8 16a8 8 0 0 1-16 0c0-4 2-8 8-16Z" fill="url(#glass)" stroke="#245fa6" stroke-width="1.6"/>
    """


def socket():
    return """
      <rect x="30" y="25" width="72" height="76" rx="16" fill="url(#rim)" transform="translate(4 6)"/>
      <rect x="25" y="22" width="72" height="76" rx="15" fill="url(#paper)" stroke="#668db8" stroke-width="2"/>
      <circle cx="61" cy="61" r="25" fill="url(#face)" stroke="#396593" stroke-width="1.5"/>
      <path d="M51 54v13m20-13v13" stroke="#12294f" stroke-width="7.3" stroke-linecap="round"/>
      <circle cx="61" cy="75" r="3.4" fill="#143668"/>
      <path d="m106 24-12 17 9 1-4 15 17-21-10-1 4-11z" fill="url(#gold)" stroke="#b47c35" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M32 45V37q0-8 9-8h13" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    """


def hourglass():
    return """
      <path d="M42 32h44q-2 15-15 28 13 13 15 32H42q2-19 15-32Q44 47 42 32Z" fill="url(#glass)" fill-opacity=".48" stroke="#235fa0" stroke-width="2.4"/>
      <path d="M47 40h34q-3 11-15 20v11q8 6 15 17H47q7-11 15-17V60Q50 51 47 40Z" fill="url(#gold)" stroke="#bb7c36" stroke-width="1.2"/>
      <path d="M36 27h57v8H36zM36 91h57v8H36z" fill="url(#rim)" transform="translate(2 3)"/>
      <rect x="34" y="24" width="60" height="11" rx="5.5" fill="url(#face)" stroke="#74334c" stroke-width="1.6"/>
      <rect x="34" y="90" width="60" height="11" rx="5.5" fill="url(#face)" stroke="#74334c" stroke-width="1.6"/>
      <path d="M41 28h45m-45 66h45" stroke="#fff0db" stroke-width="1.7" opacity=".71" stroke-linecap="round"/>
    """


def warning():
    return """
      <path d="M56 24q8-14 16 0l34 61q6 11-7 11H29q-13 0-7-11Z" fill="url(#rim)" transform="translate(2 6)"/>
      <path d="M56 24q8-14 16 0l34 61q6 11-7 11H29q-13 0-7-11Z" fill="url(#face)" stroke="#b07034" stroke-width="2"/>
      <path d="M64 43v22" stroke="#fff8e4" stroke-width="8" stroke-linecap="round"/>
      <circle cx="64" cy="80" r="4.4" fill="#fff8e4"/>
      <path d="m27 86 30-55" stroke="#fff0bd" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>
    """


def svg(width, height, palette, drawing):
    light, middle, dark, shade = PALETTES[palette]
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="face" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="{light}"/><stop offset=".38" stop-color="{middle}"/><stop offset="1" stop-color="{dark}"/>
    </linearGradient>
    <linearGradient id="rim" x1="0" y1="0" x2=".9" y2="1">
      <stop stop-color="{middle}"/><stop offset="1" stop-color="{shade}"/>
    </linearGradient>
    <linearGradient id="paper" x1="0" y1="0" x2=".9" y2="1">
      <stop stop-color="#fff8e8"/><stop offset=".49" stop-color="#f8fbff"/><stop offset="1" stop-color="#a2c7ea"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#a5e4ff"/><stop offset=".4" stop-color="#3d84c5"/><stop offset="1" stop-color="#142b59"/>
    </linearGradient>
    <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#a5e4ff"/><stop offset=".48" stop-color="#418de0"/><stop offset="1" stop-color="#163a88"/>
    </linearGradient>
    <linearGradient id="red" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#ffbaa4"/><stop offset=".42" stop-color="#ef5367"/><stop offset="1" stop-color="#aa1d43"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#fff0c1"/><stop offset=".48" stop-color="#f8c56a"/><stop offset="1" stop-color="#b67731"/>
    </linearGradient>
    <radialGradient id="shadow">
      <stop stop-color="#122751" stop-opacity=".34"/><stop offset="1" stop-color="#122751" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="halo">
      <stop stop-color="{light}" stop-opacity=".46"/><stop offset="1" stop-color="{light}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="63" cy="61" r="60" fill="url(#halo)"/>
  {ground()}
{dedent(drawing).strip()}
</svg>
"""


# Match the original assets' intrinsic boxes to preserve the layout at existing
# call sites. The square viewBox stays sharp at any rendered size.
ICONS = {
    "am_desk": (116, 72, "blue", desk()),
    "am_wardrobe": (107, 72, "gold", wardrobe()),
    "am_wc": (105, 72, "blue", washroom()),
    "am_wifi": (110, 72, "blue", wifi()),
    "as_bed": (112, 88, "blue", bed()),
    "as_doc": (95, 88, "red", document("clipboard")),
    "as_invoice": (96, 88, "gold", document("invoice")),
    "as_wrench": (98, 88, "blue", wrench()),
    "bed_blue": (72, 74, "blue", bed()),
    "bed_gray": (74, 74, "gray", bed() + badge("minus", "#516880", x=99, y=94, scale=.81)),
    "bed_green": (74, 74, "green", bed() + badge("check", "#117d60", x=99, y=94, scale=.81)),
    "bed_red": (74, 74, "red", bed() + badge("alert", "#b82446", x=99, y=94, scale=.81)),
    "bed_yellow": (72, 74, "gold", bed() + badge("alert", "#a8631f", x=99, y=94, scale=.81)),
    "bldg": (114, 69, "blue", building()),
    "fs_ok": (64, 64, "green", badge("check")),
    "fs_wait": (64, 64, "red", document() + badge("clock", CORAL, x=93, y=87, scale=1.15)),
    "fs_warn": (64, 64, "gold", warning()),
    "ic_bed_blue": (72, 74, "blue", bed()),
    "ic_bldg_blue": (74, 74, "blue", building()),
    "ic_building_sm": (79, 51, "blue", building()),
    "ic_cap": (74, 54, "blue", cap()),
    "ic_clipboard": (179, 103, "blue", document("clipboard")),
    "ic_contract": (134, 97, "blue", document("pen")),
    "ic_doc_red": (71, 68, "red", document()),
    "ic_invoice": (40, 38, "gold", document("invoice")),
    "ic_megaphone": (42, 38, "red", megaphone()),
    "ic_people": (74, 48, "blue", people()),
    "ic_room_red": (40, 38, "red", door()),
    "ic_shieldmail": (277, 144, "blue", shieldmail()),
    "ic_wrench_big": (110, 90, "red", wrench()),
    "ni_doc": (64, 64, "blue", document()),
    "ni_invoice": (64, 64, "gold", document("invoice")),
    "ni_megaphone": (64, 64, "red", megaphone()),
    "ni_wrench": (64, 64, "blue", wrench()),
    "pm_bank": (72, 62, "blue", bank()),
    "pm_counter": (74, 62, "blue", counter()),
    "pm_wallet": (72, 62, "blue", wallet()),
    "qa_extend": (140, 98, "blue", calendar()),
    "qa_feedback": (122, 98, "red", feedback()),
    "qa_repair": (132, 98, "blue", wrench()),
    "qa_transfer": (134, 98, "blue", transfer()),
    "ri_bulb": (92, 89, "gold", bulb()),
    "ri_faucet": (92, 89, "blue", faucet()),
    "ri_socket": (92, 89, "blue", socket()),
    "rs_bed": (89, 91, "blue", bed()),
    "rs_door": (89, 91, "green", door()),
    "rs_people": (89, 91, "blue", people()),
    "st_due": (82, 84, "red", document() + badge("alert", CORAL, x=93, y=87, scale=1.15)),
    "st_paid": (84, 84, "blue", document() + badge("check", "#168261", x=93, y=87, scale=1.15)),
    "st_wait": (86, 84, "red", hourglass()),
}


if __name__ == "__main__":
    output = Path(__file__).parent.parent / "ktx-website" / "assets" / "cinema" / "icons"
    output.mkdir(parents=True, exist_ok=True)
    for name, spec in ICONS.items():
        (output / f"{name}.svg").write_text(svg(*spec), encoding="utf-8", newline="\n")
    print(f"Generated {len(ICONS)} scalable icons.")
