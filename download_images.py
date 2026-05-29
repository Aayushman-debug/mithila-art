import urllib.request
import json
import sys
import os

images = {
    "chhath_puja.jpg": "File:Celebrating_Chhath_Puja.jpg",
    "sama_chakeva.jpg": "File:Sama_Chakeva_Festival.jpg",
    "mithila_cuisine.jpg": "File:Bihari_thali.jpg",
    "kohbar.jpg": "File:Kohbar_Ghar.jpg",
    "fish_motif.jpg": "File:Madhubani_painting.jpg",
    "peacock_motif.jpg": "File:Mithila_Painting.jpg",
    "lotus_motif.jpg": "File:A_Madhubani_Painting.jpg",
    "tree_of_life.jpg": "File:Tree_of_life_in_Madhubani_Art.jpg",
    "janakpur.jpg": "File:Janaki_Mandir_Janakpur_Nepal.jpg",
    "sita_devi.jpg": "File:Mithila_Painting_-_Krishna_with_Gopis.jpg",
    "ganga_devi.jpg": "File:Madhubani_art.jpg",
    "dulari_devi.jpg": "File:Madhubani_Painting_of_Ram_-_Sita_Vivah.jpg",
    "mahasundari_devi.jpg": "File:Madhubani_painting_from_bihar.jpg",
    "godavari_dutta.jpg": "File:Mithila_Painting_Display.jpg",
    "baua_devi.jpg": "File:Madhubani_art_from_Bihar.jpg",
    "bharti_dayal.jpg": "File:Mithila_art.jpg",
    "yamuna_devi.jpg": "File:Madhubani_Painting_-_Krishna_with_Gopis.jpg",
    "bharni.jpg": "File:Mithila_Painting_-_Krishna_with_Gopis.jpg",
    "kachni.jpg": "File:Madhubani_art.jpg",
    "godhana.jpg": "File:Madhubani_art_from_Bihar.jpg",
    "tantrik.jpg": "File:Madhubani_painting.jpg",
    "hero.jpg": "File:Madhubani_Painting.jpg",
    "origins.jpg": "File:Madhubani_art.jpg"
}

out_dir = "src/assets/reference"
if not os.path.exists(out_dir):
    os.makedirs(out_dir)

for out_name, wiki_file in images.items():
    print(f"Fetching {wiki_file}...")
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={wiki_file}&prop=imageinfo&iiprop=url&format=json"
    
    try:
        req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            pages = data['query']['pages']
            page = list(pages.values())[0]
            if 'imageinfo' in page:
                img_url = page['imageinfo'][0]['url']
                out_path = os.path.join(out_dir, out_name)
                print(f"Downloading to {out_path} from {img_url}...")
                urllib.request.urlretrieve(img_url, out_path)
            else:
                print(f"Could not find imageinfo for {wiki_file}. Trying Wikimedia Commons API...")
                # Fallback to Wikimedia Commons API
                commons_api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={wiki_file}&prop=imageinfo&iiprop=url&format=json"
                req2 = urllib.request.Request(commons_api_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req2) as res2:
                    data2 = json.loads(res2.read().decode())
                    pages2 = data2['query']['pages']
                    page2 = list(pages2.values())[0]
                    if 'imageinfo' in page2:
                        img_url2 = page2['imageinfo'][0]['url']
                        out_path2 = os.path.join(out_dir, out_name)
                        print(f"Downloading to {out_path2} from {img_url2}...")
                        urllib.request.urlretrieve(img_url2, out_path2)
                    else:
                        print(f"Failed to find URL for {wiki_file} on Commons as well.")
    except Exception as e:
        print(f"Error processing {wiki_file}: {e}")

print("Done.")
