import os
import sys
import json

PAGE_SIZE = 3
# usage
# python generateMockJsons.py ./HamiltonCycle/raw/ ./HamiltonCycle/sample/ ./Main/sample/


def generate(raw_dir, problem_dir, page_dir):
    id = 0
    problems = []
    for file_name in os.listdir(raw_dir):
        if not file_name.endswith('.txt'):
            continue
        id += 1
        name = file_name[0:-4]
        src_path = raw_dir + '/' + file_name
        with open(src_path, "r") as fileIn:
            N, M = (int(s) for s in fileIn.readline().split())
            E = []
            for i in xrange(0, M):
                a, b = (int(s) for s in fileIn.readline().split())
                E.append(a)
                E.append(b)
            problem = {
                "N": N,
                "M": M,
                "E": E
            }
            # for each problem
            dst_path = problem_dir + '/p' + str(id) + '.json'
            with open(dst_path, 'w') as fileOut:
                json.dump(problem, fileOut)

            profile = {
                "N": N,
                "M": M,
                "name": name,
                "id": id
            }
            problems.append(profile)

    for i in xrange(0, len(problems), PAGE_SIZE):
        part = problems[i:i + PAGE_SIZE]
        dst_path = page_dir + '/p' + str(1 + (i/PAGE_SIZE)) + '.json'
        with open(dst_path, 'w') as fileOut:
            json.dump(part, fileOut)


if __name__ == "__main__":
    generate(sys.argv[1], sys.argv[2], sys.argv[3])
