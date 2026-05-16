import requests
import os

# Unsplash photos that look like real dental professionals (high quality, authentic)
photos = {
    "doctor-1": {  # Dr. Alejandro Sanz - male dentist smiling
        "url": "https://images.unsplash.com/photo-1612349317150-e413f6a5e16d?w=800&q=85&fit=crop&crop=face",
        "filename": "doctor-1.jpg"
    },
    "doctor-2": {  # Dra. Elena Rivas - female dentist
        "url": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=85&fit=crop&crop=face",
        "filename": "doctor-2.jpg"
    },
    "doctor-3": {  # Dr. Carlos Méndez - senior male dentist
        "url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=85&fit=crop&crop=face",
        "filename": "doctor-3.jpg"
    }
}

output_dir = "/data/data/com.termux/files/home/ora-nova-2/public/images"

for key, info in photos.items():
    path = os.path.join(output_dir, info["filename"])
    print(f"Downloading {key} -> {path}")
    try:
        r = requests.get(info["url"], timeout=30, headers={"User-Agent": "Mozilla/5.0"})
        if r.status_code == 200:
            with open(path, "wb") as f:
                f.write(r.content)
            print(f"  OK ({len(r.content)} bytes)")
        else:
            print(f"  FAIL status={r.status_code}")
    except Exception as e:
        print(f"  ERROR: {e}")
