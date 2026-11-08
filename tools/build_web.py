"""Stitch src/web back into one HTML file (same steps as the Gradle buildWeb task).
usage: build_web.py <src/web dir> <out.html> [local|google]"""
import sys, os
W, OUT, MODE = sys.argv[1], sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 else 'local')
read = lambda p: open(p, encoding='utf-8').read()
css = ''.join(read(f'{W}/css/{f}') + '\n' for f in sorted(os.listdir(f'{W}/css')) if f.endswith('.css'))
js = ''.join(read(f'{W}/js/{f}') + '\n' for f in sorted(os.listdir(f'{W}/js')) if f.endswith('.js'))
if MODE == 'google':
    fonts = ("<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Silkscreen&family=Pixelify+Sans&family=DotGothic16&family=Jersey+10&display=swap\">")
else:
    fonts = '<style>\n' + read(f'{W}/fonts-local.css') + '</style>'
html = read(f'{W}/index.template.html').replace('<!--FONTS-->', fonts).replace('/*@CSS*/', css).replace('/*@JS*/', js)
open(OUT, 'w', encoding='utf-8').write(html)
print('built', OUT, len(html))
