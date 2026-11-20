import json
import zipfile

FIGCRAFT_PATH = "ParkPin_Brand_Showcase.figcraft"

def get_node_geometry(node):
    t = node.get('transform')
    if t and len(t) >= 6:
        x, y = t[4], t[5]
    else:
        x, y = node.get('x', 0.0) or 0.0, node.get('y', 0.0) or 0.0
    w = node.get('width', 0.0) or 0.0
    h = node.get('height', 0.0) or 0.0
    return float(x), float(y), float(w), float(h)

def audit():
    with zipfile.ZipFile(FIGCRAFT_PATH, 'r') as z:
        with z.open('document.json') as f:
            doc = json.load(f)

    nodes = doc.get('nodes', {})
    print("=== PART A: DOCUMENT INTEGRITY ===")
    print(f"Document Name: {doc.get('name')}")
    print(f"Format: {doc.get('format')}, Version: {doc.get('version')}")
    page_ids = doc.get('pages', [])
    print(f"Total Pages: {len(page_ids)} -> {page_ids}")
    for pid in page_ids:
        p = nodes.get(str(pid), {})
        print(f"  Page ID {pid}: '{p.get('name')}' (Type: {p.get('type')}, Children Count: {len(p.get('children', []))})")

    page1 = nodes.get('1', {})
    artboard_ids = page1.get('children', [])
    print(f"\nPage 1 Artboards Count: {len(artboard_ids)}")

    # Check Page 100
    page100 = nodes.get('100', {})
    p100_children = page100.get('children', [])
    print(f"Page 100 Artboards Count: {len(p100_children)}")
    for cid in p100_children:
        c = nodes.get(str(cid), {})
        x, y, w, h = get_node_geometry(c)
        print(f"  Page 100 Section ID {cid}: '{c.get('name')}' ({w:.1f}x{h:.1f}) at ({x:.1f}, {y:.1f})")

    print("\n=== PART B & C: INDEPENDENT VERTICAL BALANCE & ERGONOMICS AUDIT ===")
    
    audit_data = []

    for idx, ab_id in enumerate(artboard_ids, 1):
        ab = nodes.get(str(ab_id), {})
        ab_name = ab.get('name')
        ab_x, ab_y, ab_w, ab_h = get_node_geometry(ab)
        ab_children_ids = ab.get('children', [])

        children = [nodes.get(str(cid), {}) for cid in ab_children_ids]

        status_bar = None
        home_indicator = None
        bottom_nav = None
        content_nodes = []
        buttons = []

        for ch in children:
            name_lower = ch.get('name', '').lower()
            ch_x, ch_y, ch_w, ch_h = get_node_geometry(ch)

            if 'status bar' in name_lower or 'statusbar' in name_lower:
                status_bar = ch
            elif 'home indicator' in name_lower or 'indicator' in name_lower:
                home_indicator = ch
            elif 'bottom nav' in name_lower or ('nav' in name_lower and ch_y > 700):
                bottom_nav = ch
            elif 'backdrop' in name_lower or 'scrim' in name_lower or 'overlay' in name_lower and ch_w >= 390 and ch_h >= 800:
                pass # background dimming
            else:
                content_nodes.append(ch)

            # Check for buttons or CTAs
            def find_buttons(node):
                n_lower = node.get('name', '').lower()
                nx, ny, nw, nh = get_node_geometry(node)
                if any(k in n_lower for k in ['btn', 'button', 'cta', 'action', 'simpan', 'cari', 'masuk', 'daftar', 'buka', 'retry', 'ijinkan', 'lanjut', 'tutup', 'batal', 'archive']):
                    buttons.append({
                        "id": node.get('id'),
                        "name": node.get('name'),
                        "x": nx,
                        "y": ny,
                        "w": nw,
                        "h": nh,
                        "bottom": ny + nh
                    })
                for sub_id in node.get('children', []):
                    sub_node = nodes.get(str(sub_id), {})
                    s_lower = sub_node.get('name', '').lower()
                    sx, sy, sw, sh = get_node_geometry(sub_node)
                    if any(k in s_lower for k in ['btn', 'button', 'cta', 'action', 'simpan', 'cari', 'masuk', 'daftar', 'buka', 'retry', 'ijinkan', 'lanjut', 'tutup', 'batal', 'archive']):
                        buttons.append({
                            "id": sub_node.get('id'),
                            "name": sub_node.get('name'),
                            "x": sx,
                            "y": sy,
                            "w": sw,
                            "h": sh,
                            "bottom": sy + sh
                        })

            find_buttons(ch)

        # Content vertical extent
        if content_nodes:
            min_y = min(get_node_geometry(c)[1] for c in content_nodes)
            max_y = max(get_node_geometry(c)[1] + get_node_geometry(c)[3] for c in content_nodes)
        else:
            min_y, max_y = 0.0, 0.0

        # Determine reference bottom
        if bottom_nav:
            bottom_ref = get_node_geometry(bottom_nav)[1]
            ref_type = f"Bottom Nav Top (y={bottom_ref:.1f})"
        elif home_indicator:
            bottom_ref = get_node_geometry(home_indicator)[1]
            ref_type = f"Home Indicator Top (y={bottom_ref:.1f})"
        else:
            bottom_ref = ab_h
            ref_type = f"Screen Bottom (y={bottom_ref:.1f})"

        bottom_gap = bottom_ref - max_y

        # Classify screen type
        name_lower = ab_name.lower()
        if 'modal' in name_lower or 'sheet' in name_lower or ab_id in [1705, 1889, 1911]:
            screen_type = "Modal / Bottom Sheet"
        elif bottom_nav:
            screen_type = "Primary Screen with Bottom Nav"
        elif 'empty' in name_lower or ab_id in [1611]:
            screen_type = "Empty State"
        elif 'loading' in name_lower or 'upload' in name_lower or ab_id in [1646, 1767, 1821]:
            screen_type = "Loading / Progress State"
        elif 'error' in name_lower or 'failed' in name_lower or 'unavailable' in name_lower or ab_id in [1679, 1728, 1792, 1862]:
            screen_type = "Error / Exception State"
        else:
            screen_type = "Content Screen with Sticky/Bottom CTA"

        # Sort content layers by y
        content_layers_info = []
        for c in content_nodes:
            cx, cy, cw, ch = get_node_geometry(c)
            content_layers_info.append({
                "id": c.get('id'),
                "name": c.get('name'),
                "type": c.get('type'),
                "x": cx,
                "y": cy,
                "w": cw,
                "h": ch,
                "bottom": cy + ch
            })
        content_layers_info.sort(key=lambda item: item['y'])

        data = {
            "index": idx,
            "id": ab_id,
            "name": ab_name,
            "screen_type": screen_type,
            "w": ab_w,
            "h": ab_h,
            "pos": (ab_x, ab_y),
            "children_count": len(children),
            "has_status_bar": status_bar is not None,
            "has_home_indicator": home_indicator is not None,
            "has_bottom_nav": bottom_nav is not None,
            "content_top": min_y,
            "content_bottom": max_y,
            "content_span": max_y - min_y,
            "bottom_ref_type": ref_type,
            "bottom_gap": bottom_gap,
            "content_layers": content_layers_info,
            "buttons": buttons
        }
        audit_data.append(data)

        print(f"\n[{idx:02d}] ID {ab_id} — {ab_name} [{screen_type}]")
        print(f"     Artboard: {ab_w:.0f}x{ab_h:.0f} at ({ab_x:.0f}, {ab_y:.0f}) | Total layers: {len(children)}")
        print(f"     Content Extent: y={min_y:.1f} to y={max_y:.1f} (Span: {max_y - min_y:.1f}px)")
        print(f"     Bottom Ref: {ref_type} | Gap to Ref: {bottom_gap:.1f}px")
        if buttons:
            print(f"     Key Action Buttons ({len(buttons)}):")
            for b in buttons:
                print(f"       - '{b['name']}' (id:{b['id']}): {b['w']:.0f}x{b['h']:.0f} at y={b['y']:.0f} (bottom={b['bottom']:.0f})")

    with open("audit_results.json", "w") as out:
        json.dump(audit_data, out, indent=2)
    print("\nSaved comprehensive audit_results.json successfully.")

if __name__ == "__main__":
    audit()
