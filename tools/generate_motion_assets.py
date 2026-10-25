"""Rebuild the site's original vector motion artwork. No network or third-party art.

Photographs, the university logo and payment QR stay byte-for-byte unchanged.
SVGs use independent animated groups and honor prefers-reduced-motion / #still.
"""
from pathlib import Path
import base64
import hashlib
import json
import math

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'ktx-website' / 'assets'
OUT = ASSETS / 'motion'
PRESERVE = {'logo', 'qr', 'ev_bike', 'ev_fair', 'ev_opening', 'ev_volley',
            'mo_booth', 'mo_court', 'mo_sport', 'h_common', 'meter_e', 'meter_w', 'lamp', 'thumb_bath'}

DEFS = '''<defs>
 <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff1b8"/><stop offset=".48" stop-color="#e7b35c"/><stop offset="1" stop-color="#a8642d"/></linearGradient>
 <linearGradient id="front" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#486eab"/><stop offset=".5" stop-color="#233f70"/><stop offset="1" stop-color="#101d3d"/></linearGradient>
 <linearGradient id="side" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#182c54"/><stop offset="1" stop-color="#080e24"/></linearGradient>
 <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b3faff"/><stop offset=".4" stop-color="#4ec2e7"/><stop offset="1" stop-color="#1c4c80"/></linearGradient>
 <linearGradient id="floor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6384aa"/><stop offset="1" stop-color="#1c2c4d"/></linearGradient>
 <linearGradient id="cloth" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#74e6e6"/><stop offset="1" stop-color="#2674a3"/></linearGradient>
 <radialGradient id="halo"><stop stop-color="#32d5ef" stop-opacity=".28"/><stop offset="1" stop-color="#32d5ef" stop-opacity="0"/></radialGradient>
 <radialGradient id="sky"><stop stop-color="#183c64"/><stop offset="1" stop-color="#09152d"/></radialGradient>
 <filter id="glow" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="3"/></filter>
 <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#57bbd6" stroke-opacity=".09"/></pattern>
</defs>'''
STYLE = '''<style>
 .float{animation:float 7s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
 .float2{animation:float 8s ease-in-out -3s infinite;transform-box:fill-box;transform-origin:center}
 .orbit{animation:orbit 26s linear infinite;transform-box:fill-box;transform-origin:center}
 .reverse{animation-direction:reverse;animation-duration:38s}
 .pulse{animation:pulse 4s ease-in-out infinite}.twinkle{animation:pulse 3s ease-in-out infinite alternate}
 .flow{stroke-dasharray:12 24;animation:flow 12s linear infinite}
 .sway{animation:sway 5s ease-in-out infinite;transform-box:fill-box;transform-origin:bottom center}
 .light{animation:light 6s ease-in-out infinite alternate}.rise{animation:rise 8s ease-in-out infinite}
 @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}
 @keyframes orbit{to{transform:rotate(360deg)}}
 @keyframes pulse{0%,100%{opacity:.35}50%{opacity:1}}
 @keyframes flow{to{stroke-dashoffset:-360}}
 @keyframes sway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
 @keyframes light{from{opacity:.4}to{opacity:1}}
 @keyframes rise{0%,100%{transform:translateY(0);opacity:.3}50%{transform:translateY(-30px);opacity:1}}
 :root:target *{animation:none!important}
 @media(prefers-reduced-motion:reduce){*{animation:none!important}}
</style>'''

def svg(body, w, h, title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" id="still" viewBox="0 0 {w} {h}" role="img" aria-label="{title}">{DEFS}{STYLE}{body}</svg>'

def particles(w=1200, h=850, n=38):
    return ''.join(f'<circle class="rise" cx="{(i*193+43)%w}" cy="{(i*137+91)%h}" r="{1+i%3}" fill="{["#78e6f7", "#f4d18e"][i%2]}" style="animation-delay:-{i%8}s"/>' for i in range(n))

def tree(x,y,s=1):
    return f'<g transform="translate({x} {y}) scale({s})"><g class="sway"><path d="M0 12V-63" stroke="#ba965f" stroke-width="6"/><path d="M0-70C-54-52-34-4 0-20C36-2 51-54 0-70Z" fill="#2c9e9c"/><path d="M0-70V-20C36-2 51-54 0-70" fill="#1c656e"/><path d="M-19-44L0-28L20-44" fill="none" stroke="#6de0cb" stroke-opacity=".5" stroke-width="2"/></g></g>'

def tower(x, y, scale=1, floors=5, label=False):
    windows = ''
    for row in range(floors):
        for col in range(5):
            px,py=36+col*36,64+row*42
            windows += f'<g transform="translate({px} {py})"><path d="M0 0L24-7V21L0 28Z" fill="url(#glass)" class="light" style="animation-delay:-{(col+row)%6}s"/><path d="M12-3V24M0 12L24 5" stroke="#233c60" stroke-width="2"/></g>'
    return f'''<g transform="translate({x} {y}) scale({scale})">
      <path d="M0 30L220-35L305 12L85 78Z" fill="#96adc0" stroke="#e7c27f" stroke-width="2"/>
      <path d="M0 30L220-35V{floors*42+75}L0 {floors*42+140}Z" fill="url(#front)"/>
      <path d="M220-35L305 12V{floors*42+122}L220 {floors*42+75}Z" fill="url(#side)"/>
      <path d="M0 30L220-35L305 12M220-35V{floors*42+75}" fill="none" stroke="#e5bc74" stroke-width="3"/>
      {windows}
      <path d="M18 {floors*42+116}L201 {floors*42+62}" stroke="#60d7e8" stroke-width="3"/>
      <path d="M237 5L286 32V{floors*42+91}L237 {floors*42+64}Z" fill="#183558" stroke="#416583"/>
      <path d="M252 23V{floors*42+72}M273 35V{floors*42+84}" stroke="#61c5df" stroke-opacity=".65" stroke-width="3"/>
      <path d="M45 12L185-29L248 6L109 47Z" fill="#263b58" stroke="#aec6d2"/>
      {('<text x="65" y="62" fill="#ffe6ad" font-size="18" font-family="sans-serif" letter-spacing="5" transform="skewY(-16)">NAU</text>' if label else '')}
    </g>'''

def campus(name, wide=False):
    body = '''<rect width="1200" height="850" fill="url(#sky)"/><rect width="1200" height="850" fill="url(#grid)"/>
    <ellipse cx="610" cy="470" rx="570" ry="360" fill="url(#halo)"/>
    <g fill="none" stroke-width="1"><ellipse cx="620" cy="625" rx="470" ry="160" stroke="#3d819b"/><ellipse class="flow" cx="620" cy="625" rx="500" ry="185" stroke="#70dfee"/><ellipse class="flow" cx="620" cy="625" rx="412" ry="137" stroke="#e6c27c"/></g>
    <g class="float"><path d="M200 565L670 385L1040 580L568 770Z" fill="#101c35" stroke="#82cbd7" stroke-width="2"/>
    <path d="M200 565V597L568 802V770Z" fill="#1b2e4a"/><path d="M568 770L1040 580V613L568 802Z" fill="#0b142b"/>
    <path d="M230 567L669 403L1009 581L570 747Z" fill="#244451"/><path d="M230 567L669 403L1009 581" fill="none" stroke="#f0c885" stroke-width="3"/>
    <path d="M430 650L715 530L834 595L546 711Z" fill="#92a1a3"/>
    '''
    body+=tower(360,300,1.24,5,True)+tower(688,358,.79,4)
    body+=''.join(tree(x,y,s) for x,y,s in [(320,550,1.2),(825,625,1.2),(908,576,.9),(704,693,.95),(442,673,1),(625,440,.7),(270,566,.8)])
    body+='''<path d="M350 654L550 760L919 612" fill="none" stroke="#6be1dc" stroke-width="3" class="flow"/></g>
    <g class="float2"><path d="M869 185L921 155L973 185V246L921 276L869 246Z" fill="#123957" stroke="#64dce8"/><path d="M895 213L914 232L949 196" fill="none" stroke="#f8d993" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>
    <g class="float"><circle cx="233" cy="322" r="45" fill="#142e4c" stroke="#e6be7b"/><path d="M210 321L232 307L256 321L232 335Z M218 328V341Q233 354 247 341V328" fill="none" stroke="#e7c484" stroke-width="4"/></g>
    <path d="M995 365L1012 400L1049 406L1022 433L1028 470L995 453L962 470L968 433L941 406L978 400Z" fill="none" stroke="#b6eaf2" opacity=".5" class="pulse"/>
    '''+particles()
    if wide:
        return svg(f'<g transform="translate(0 -40)">{body}</g>',1200,760,'Animated university residence')
    return svg(body,1200,850,'Animated university residence')

def bed(x,y,s=1):
    return f'''<g transform="translate({x} {y}) scale({s})"><path d="M0 0L150-40L240 10L90 53Z" fill="#d0e1eb"/>
    <path d="M0 0V110L90 161V53Z" fill="#304e74"/><path d="M90 53L240 10V119L90 161Z" fill="#182d50"/>
    <path d="M10-5L151-43L225 0L86 40Z" fill="url(#cloth)"/><path d="M17-4L61-16L123 18L86 29Z" fill="#dceffa"/>
    <path d="M0-65V122M90-16V176M240-58V133M150-105V-43M0-64L150-105L240-58L90-16Z" fill="none" stroke="url(#metal)" stroke-width="7" stroke-linejoin="round"/>
    <path d="M8-69L151-107L229-62L88-24Z" fill="#327a9b"/><path d="M20-70L57-80L115-47L87-37Z" fill="#dceffa"/>
    <path d="M188-45V133M210-52V126M188-15L210-22M188 15L210 8M188 45L210 38M188 75L210 68M188 105L210 98" fill="none" stroke="#d8ba82" stroke-width="4"/>
    <path d="M95 62L231 23" stroke="#65dde8" stroke-width="3" class="light"/>
    </g>'''

def room(name):
    hue=int(hashlib.md5(name.encode()).hexdigest()[:2],16)%24
    body='''<rect width="1000" height="650" fill="#0a1730"/><ellipse cx="530" cy="350" rx="500" ry="315" fill="url(#halo)"/>
    <g class="float2"><path d="M80 388L500 215L925 388L505 602Z" fill="url(#floor)" stroke="#7bc5d6" stroke-width="2"/>
    <path d="M80 388V150L500 12V215Z" fill="#263c60"/><path d="M500 12L925 150V388L500 215Z" fill="#182d4e"/>
    <path d="M80 150L500 12L925 150M500 12V215M80 388L505 602L925 388" fill="none" stroke="url(#metal)" stroke-width="4"/>
    <path d="M551 66L836 159V323L551 217Z" fill="url(#glass)"/><path d="M551 174L836 270M648 97V250M744 127V287" stroke="#bfeaf4" stroke-width="5"/>
    <path d="M566 83L628 104L628 239L566 216Z" fill="#daf7f4" opacity=".14" class="sway"/>
    <path d="M848 163L883 173V344L848 332Z" fill="#40b4bc" class="sway"/>
    <path d="M270 376L617 266L750 340L408 465Z" fill="#173c53" stroke="#508a9c"/>
    '''
    if 'desk' in name or name in {'study','thumb_wardrobe'}:
        body+='''<path d="M160 291L479 183L625 248L300 365Z" fill="url(#metal)"/><path d="M174 297V400M310 363V472M602 251V361" stroke="#82a9be" stroke-width="9"/>
        <g class="float"><path d="M323 254L435 215L473 285L360 326Z" fill="#122743" stroke="#81dbeb" stroke-width="3"/><path d="M334 257L429 225L459 281L363 313Z" fill="url(#glass)"/><path d="M361 326L474 285L510 305L395 348Z" fill="#7caabf"/></g>'''
    else:
        body+=bed(183,332,.95)+bed(547,400,.94)
    body+='''<path d="M779 370L874 332L917 354L822 394Z" fill="url(#metal)"/><path d="M789 374V450M894 362V410M826 394V473" stroke="#9fb6c4" stroke-width="7"/>
    <g class="pulse"><path d="M846 337V284L819 273" fill="none" stroke="#edc987" stroke-width="5"/><path d="M803 274L818 250L848 264L836 286Z" fill="#ffdf9b"/></g>
    '''+tree(135,365,.85)+'''</g>'''+particles(1000,650,18)
    return svg(f'<g style="filter:hue-rotate({hue-12}deg)">{body}</g>',1000,650,'Animated residence interior')

SYMBOLS = {
 'bed':'<path d="M-65 10V-25Q-65-35-50-35H45Q60-35 60-20V25M-65 10H65V43M-65 43V-53M-59-12H60M-48-28H-14"/>',
 'doc':'<path d="M-40-65H20L48-37V62H-40Z M20-65V-37H48M-22-14H25M-22 5H25M-22 24H10"/><path d="M6 44L22 58L54 25" stroke="#79f4da"/>',
 'wrench':'<path d="M-52 45L8-15C-7-45 18-71 45-60L23-38L40-21L63-44C75-13 47 11 19-2L-41 58Z"/><circle cx="-39" cy="44" r="5"/>',
 'wifi':'<path d="M-62-24Q0-81 62-24M-43-3Q0-43 43-3M-23 19Q0-3 23 19"/><circle cx="0" cy="43" r="8" fill="url(#metal)"/>',
 'cap':'<path d="M-73-17L0-54L73-17L0 20Z M-42 0V34Q0 64 42 34V0M68-14V37"/>',
 'building':'<path d="M-50 62V-50L10-68L52-45V62Z M10-68V62M-31-33V-12M-11-39V-18M-31 5V25M-11-1V19M28-34V-10M28 7V31M-15 62V41H7V62"/>',
 'people':'<circle cx="0" cy="-35" r="23"/><path d="M-43 60V32Q0-14 43 32V60ZM-50-30Q-83-20-58 7M50-30Q83-20 58 7M-53 16Q-85 30-73 60M53 16Q85 30 73 60"/>',
 'wallet':'<path d="M-60-35L29-63L46-37M-60-35H58V55H-60Z M58-7H20V25H58"/><circle cx="34" cy="9" r="4"/>',
 'door':'<path d="M-45 62V-62H45V62M-25 62V-44L30-31V62M10 13V21M-64 62H65"/>',
 'shield':'<path d="M0-67L59-42V-5Q55 44 0 68Q-55 44-59-5V-42Z M-27 0L-6 22L32-21"/>',
 'bulb':'<path d="M-23 29C-26 8-49-3-45-30C-37-82 39-82 45-30C49-3 26 8 23 29ZM-23 45H23M-15 61H15M0-49V2M-68-42L-82-51M68-42L82-51"/>',
 'faucet':'<path d="M-59 49V-8Q-59-34-35-34H28V-8H-25V49M-17-34V-54M-36-54H6M28-18H60V9M-72 50H-11"/><path d="M59 28Q37 57 59 68Q82 57 59 28Z" fill="url(#glass)"/>',
 'megaphone':'<path d="M-54-14L54-58V49L-54 15ZM-33 23L-17 62H9L-5 12M69-21L85-28M70 11L89 16"/>',
 'bank':'<path d="M-70-29L0-67L70-29ZM-63 59H63M-52 44H52M-46-15V44M-15-15V44M15-15V44M46-15V44"/>',
 'clock':'<circle r="61"/><path d="M0-38V2L29 20M-12-77H12"/>',
 'check':'<circle r="62"/><path d="M-32 0L-8 26L37-28"/>',
 'sofa':'<path d="M-55 0V-34Q0-66 55-34V0M-56 12Q-80-30-80 10V48H80V10Q80-30 56 12ZM-61 48V61M61 48V61"/>',
 'suitcase':'<rect x="-48" y="-49" width="96" height="111" rx="13"/><path d="M-21-49V-70H21V-49M-22-27V40M0-27V40M22-27V40M-29 62V73M29 62V73"/>',
 'guitar':'<path d="M5-4L45-64L61-54L24 8C69 52 19 87-8 60C-58 78-80 14-36-5C-19-15-8-15 5-4Z"/><circle cx="-10" cy="24" r="13"/><path d="M-29 53L52-58"/>',
 'message':'<path d="M-65-49H65V34H-10L-45 63V34H-65Z M-38-20H38M-38 2H17"/>',
}

def kind(name):
    if any(x in name for x in ('wrench','repair','socket','tech')): return 'wrench'
    if 'wifi' in name: return 'wifi'
    if 'faucet' in name or 'wc' in name: return 'faucet'
    if any(x in name for x in ('bulb','lamp')): return 'bulb'
    if 'bed' in name: return 'bed'
    if any(x in name for x in ('people','group','community')): return 'people'
    if any(x in name for x in ('shield','sec_')): return 'shield'
    if 'cap' in name: return 'cap'
    if 'bank' in name: return 'bank'
    if any(x in name for x in ('invoice','wallet','paid','due','fin_','counter')): return 'wallet'
    if 'megaphone' in name: return 'megaphone'
    if any(x in name for x in ('wait','extend')): return 'clock'
    if any(x in name for x in ('feedback',)): return 'message'
    if 'door' in name or 'wardrobe' in name: return 'door'
    if any(x in name for x in ('bldg','building','room')): return 'building'
    if any(x in name for x in ('ok','check')): return 'check'
    if 'suitcase' in name: return 'suitcase'
    return 'doc'

def icon(name):
    color='#7ce6ed'
    if any(x in name for x in ('red','due','warn')): color='#ffad95'
    if any(x in name for x in ('green','ok','paid')): color='#7ceac4'
    body=f'''<ellipse cx="120" cy="128" rx="117" ry="110" fill="url(#halo)"/>
    <ellipse cx="120" cy="198" rx="80" ry="20" fill="#0c213d" stroke="{color}" stroke-opacity=".5"/>
    <ellipse cx="120" cy="198" rx="94" ry="26" fill="none" stroke="#e6c27c" stroke-dasharray="4 12" class="flow"/>
    <g class="float"><g transform="translate(120 112) scale(.82)"><circle r="95" fill="url(#side)" stroke="#5c7997" stroke-width="1"/>
    <circle r="85" fill="none" stroke="url(#metal)" stroke-width="1"/><g class="pulse" fill="none" stroke="{color}" stroke-width="15" opacity=".18" filter="url(#glow)">{SYMBOLS[kind(name)]}</g>
    <g fill="none" stroke="url(#metal)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">{SYMBOLS[kind(name)]}</g></g></g>
    <circle cx="25" cy="59" r="3" fill="{color}" class="rise"/><path d="M206 39V55M198 47H214" stroke="#e5bf80" stroke-width="2" class="twinkle"/>'''
    return svg(body,240,240,'Animated '+kind(name))

def person(x,y,s=1,seed=0):
    hair=['#101a32','#3e2940','#3c2e29'][seed%3]
    return f'''<g transform="translate({x} {y}) scale({s})"><g class="sway">
    <path d="M-65 27Q-78-69 0-75Q77-67 65 27L43 49H-43Z" fill="{hair}"/>
    <path d="M-55-12Q-47-66 0-56Q48-61 55-12V30Q35 85 0 83Q-38 79-55 30Z" fill="#eab18f"/>
    <path d="M-55-12Q-65-65 0-74Q70-61 55-2Q30-3 6-44Q-5-5-55-12Z" fill="{hair}"/>
    <path d="M-30 14H-18M18 14H30" stroke="#24354d" stroke-width="5" stroke-linecap="round"/><path d="M-12 46Q0 57 14 44" fill="none" stroke="#b77568" stroke-width="4" stroke-linecap="round"/>
    <path d="M-17 76V99H17V76" fill="#d6987c"/><path d="M-17 91Q-89 91-103 180H103Q89 91 17 91L0 125Z" fill="url(#front)"/>
    <path d="M-17 91L0 125L17 91M0 125V180" fill="none" stroke="url(#metal)" stroke-width="4"/>
    <path d="M-72 136L-44 181M72 136L42 181" stroke="#65929f" stroke-width="4"/>
    <path d="M-42 155L39 143L54 196L-28 208Z" fill="url(#metal)"/><path d="M-29 163L28 155M-25 175L31 166" stroke="#b58248" stroke-width="3"/>
    </g></g>'''

def character(name):
    seed=int(hashlib.md5(name.encode()).hexdigest()[:2],16)
    if name.startswith('av_') or name=='photo_tuananh':
        return svg('<circle cx="150" cy="150" r="144" fill="url(#sky)" stroke="url(#metal)" stroke-width="3"/><circle cx="150" cy="150" r="135" fill="none" stroke="#5edce7" stroke-dasharray="4 18" class="orbit"/>'+person(150,129,1.05,seed),300,340,'Animated student portrait')
    body='<rect width="900" height="600" fill="url(#sky)"/><ellipse cx="450" cy="300" rx="450" ry="320" fill="url(#halo)"/>'
    body+='<ellipse cx="460" cy="494" rx="320" ry="62" fill="#132b43" stroke="#5cc4d1" stroke-dasharray="5 15" class="flow"/>'
    group=name in {'community','community_big','group4','h_guitar','cover_comm'}
    if group:
        body+=person(268,265,.9,seed+1)+person(638,265,.9,seed+2)
    else:
        body+=tower(105,243,.55,4)
    body+=person(458,230,1.35,seed)
    body+='<g class="float2" transform="translate(700 135)"><circle r="64" fill="#15364c" stroke="#77e3e7"/><g fill="none" stroke="url(#metal)" stroke-width="5" stroke-linecap="round" transform="scale(.6)">'+SYMBOLS['guitar' if 'guitar' in name else 'cap']+'</g></g>'
    return svg(body+particles(900,600,22),900,600,'Animated campus life illustration')

def main():
    OUT.mkdir(exist_ok=True)
    mapping={}
    room_names={'bg_new','bg_old','bg_thumb','cp_cur','cp_new','detail_main','gh_room','h_room4','h_room6','thumb_desk','thumb_wardrobe','study'}
    chars={'advisor','art_writing','community','community_big','cover_comm','group4','h_girl','h_guitar','h_ready','invoice_promo','student_art','tech_art','side_boy','sec_art','shield_key'}
    buildings={'hero','bldg','step1','step3','find_other','stay_thumb','side_admin_art','side_admin_art2','side_art5','forgot_art','login_art','register_art','h_foot','h_cta','kport_art','kport_art2','banner_welcome'}
    for p in sorted(ASSETS.glob('*.jpg')):
        name=p.stem
        if name in PRESERVE: continue
        if name in room_names or name.startswith('room_'): content=room(name)
        elif name in chars or name.startswith('av_') or name=='photo_tuananh': content=character(name)
        elif name in buildings or name.startswith(('banner_','bn_')): content=campus(name,True)
        else: content=icon(name)
        content = '\n'.join(line.rstrip() for line in content.splitlines()) + '\n'
        (OUT / (name+'.svg')).write_text(content,encoding='utf8')
        mapping[name]='assets/motion/'+name+'.svg'
    (ROOT/'ktx-website/js/motion-assets.js').write_text('/* Generated by tools/generate_motion_assets.py. Photographs are preserved. */\nwindow.KTX_MOTION_ASSETS = Object.freeze('+json.dumps(mapping,indent=2)+');\n',encoding='utf8')
    manifest={'animated':mapping,'preserved':{n:hashlib.sha256((ASSETS/(n+'.jpg')).read_bytes()).hexdigest() for n in sorted(PRESERVE)}}
    (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf8')
    print(f'Generated {len(mapping)} animated SVG assets; preserved {len(PRESERVE)} originals.')

if __name__=='__main__': main()
