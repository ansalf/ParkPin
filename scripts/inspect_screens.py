import zipfile, json

z = zipfile.ZipFile("ParkPin_Brand_Showcase.figcraft")
d = json.load(z.open("document.json"))
nodes = d["nodes"]
page1 = nodes["1"]

def get_geom(node):
    t = node.get("transform")
    x = t[4] if t and len(t)>=6 else (node.get("x") or 0.0)
    y = t[5] if t and len(t)>=6 else (node.get("y") or 0.0)
    w = node.get("width") or 0.0
    h = node.get("height") or 0.0
    return float(x), float(y), float(w), float(h)

for ab_id in page1["children"]:
    ab = nodes[str(ab_id)]
    x, y, w, h = get_geom(ab)
    print(f"\n==================================================")
    print(f"ARTBOARD {ab['name']} (ID: {ab_id}) - {w:.0f}x{h:.0f} at ({x:.0f}, {y:.0f})")
    print(f"==================================================")
    
    children = [nodes[str(cid)] for cid in ab.get("children", [])]
    # sort by y
    children.sort(key=lambda c: get_geom(c)[1])
    
    prev_bottom = None
    for c in children:
        cx, cy, cw, ch = get_geom(c)
        c_bottom = cy + ch
        gap_str = f"[Gap from prev: {cy - prev_bottom:+.1f}px]" if prev_bottom is not None else ""
        print(f"  - {c.get('name', 'unnamed'):<32} | y={cy:5.1f}..{c_bottom:5.1f} (h={ch:5.1f}, w={cw:5.1f}) {gap_str}")
        prev_bottom = c_bottom

