from __future__ import annotations
import re


if __name__ == '__main__':
    with open('data/shootings.ttl', "r") as f:
        data = f.readlines()

    for i, line in enumerate(data):
        if ':hasDirector' in line and '"' in line:
            raw_directors = re.findall(r'"(.*)"', line)[0]
            for sep in ['et', '-']:
                pattern = r'\s+' + sep + r'\s+'
                if re.search(pattern, raw_directors):
                    directors = ", ".join([f'"{w}"' for w in re.split(pattern, raw_directors)])
                    line = line.replace('"' + raw_directors + '"', directors)
                    data[i] = line
    
    with open("output.ttl", "w+") as f:
        f.writelines(data)

