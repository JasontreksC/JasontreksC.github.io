---
layout: post
title: FAISS Index
description: 대표적인 Vector DB 라이브러리
date: 2025-10-14
collection_id: markit-rag-project
order: 2
---
## I. FAISS chapter 1 - Flat, IVFFlat, IVFPQ 
**FAISS**는 **Facebook AI Simillarity Search**의 약자로, 페이스북에서 개발한 벡터 기반 유사도 검색 라이브러리이다.

#### 인덱싱

FAISS는 수십억개 규모의 밀집 벡터들을 효율적으로 검색하기 위해 강력한 인덱싱 기능을 제공한다. **인덱싱**이란 비슷한 의미를 지닌 벡터들끼리 사전 분류작업을 하는것으로, 도서관에서 도서의 장르별로 배치를 분류하는 작업이라고 볼 수 있다.

FAISS에서 제공하는 주된 인덱싱 방법은 세가지가 있다.

- **IndexFlatL2:** 무차별 대입(brute force) 방식으로 하나의 벡터와 다른 모든 벡터들간의 유클리드 거리(L2)를 비교하여 가장 가까운 벡터를 찾아낸다.
- **IndexIVFFlat:** 전체 공간에 여러개의 **중심점(Centeroid)** 을 생성하고 각 벡터들은 가장 가까운 중심점을 찾아 군집화한다. 검색시에는 쿼리 벡터와 가까운 몇개의 중심점들을 찾고 그에 속한 벡터들만 검색하여 검색 시간을 단축시킨다. 이때 필요한 사전 작업을 **클러스터링(Clustering)** 이라고 한다.
- **IndexIVFPQ:** IVF 방식에 **제품 양자화(Product Quantization)** 과정을 추가한 인덱싱 방법이다. 벡터를 매우 작은 크기로 압축함으로서 정확성을 약간 포기한 대신 메모리 사용량을 극적으로 줄이고 속도를 높였다.

데이터셋의 규모가 거대해질수록 IndexFlatL2 -> IndexIVFFlat -> IndexIVFPQ 순으로 높은 효율을 보인다.

>**IndexFlatIP는?**
>L2는 유클리디안 거리를 측정하지만 IP(Inner Product)는 벡터 내적으로 거리를 계산한다.
>![](/assets/images/faiss-1.png)

#### IndexFlatL2 시각화
![](/assets/images/faiss-2.png)
![](/assets/images/faiss-3.png)
#### IndexIVF 시각화
![](/assets/images/faiss-4.png)
#### 검색 시간 비교
![](/assets/images/faiss-5.png)

#### IndexFlatL2 예제

```python
import numpy
import faiss
from sentence_transformers import SentenceTransformer

# 임베딩 모델 초기화
model: SentenceTransformer = SentenceTransformer('bert-base-nli-mean-tokens')

# 사전에 임베딩된 벡터들을 불러온다.
for i in range(57):
	if i == 0:
		with open(f"sentence_embeddings/embeddings_{i}.npy", "rb") as fp:
			sentence_embeddings = numpy.load(fp)
	else:
		with open(f"sentence_embeddings/embeddings_{i}.npy", "rb") as fp:
			sentence_embeddings = numpy.append(
				sentence_embeddings,
				numpy.load(fp),
				axis=0
			)

# 원본 텍스트파일도 불러온다.
with open("sentence_embeddings/sentences.txt") as fp:
	lines = fp.read().split("\n")

# 벡터의 차원 수를 구한다
d = sentence_embeddings.shape[1]
# 인덱스 생성
index = faiss.IndexFlatL2(d)
# 인덱스에 벡터 임베드 데이터를 추가
index.add(sentence_embeddings)

# 쿼리 문장
xq = model.encode(['someone sprints with a football'])
# 검색 결과로 받을 문장 수
k = 4
# 겸색
D, I = index.search(xq, k)
# D: 거리
# I: 문장의 줄 번호
# D와 I는 각각 2차원배열이다. 쿼리 문장이 1개라면 0번째 원소만 쓰면 된다.

# 결과 출력
count = 0
for i in I[0]:
	print(f'[{i}]: "{lines[i]}"\ndistance: {D[0][count]}')
	count += 1
```
IndexFlatL2 검색 결과
- 쿼리 문장: `'someone sprints with a football'`
- 검색 시간: `0.001566499937325716`

```
[4586]: "A group of football players is running in the field"
distance: 54.623779296875
[10252]: "A group of people playing football is running in the field"
distance: 54.853519439697266
[12465]: "Two groups of people are playing football"
distance: 57.35627365112305
[190]: "A person playing football is running past an official carrying a football"
distance: 57.90591812133789
``` 

#### 클러스터링
인접한 벡터들끼리 클러스터를 형성하여, 검색시 모든 벡터들이 아닌 **특정 클러스터 내의 벡터들만 검색**하기에 검색 효율이 증가한다. 데이터셋의 규모가 클수록 그 효율은 증가한다. 다만 벡터의 물리적 거리가 가까워도 클러스터가 다르다는 이유로 검색 결과에서 제외되는 경우가 종종 있을 수 있기에 정확도는 L2보다는 낮다.
![](/assets/images/faiss-6.png)
FAISS의 클러스터링 과정의 핵심은 전체 벡터 공간에서 여러개의 중심점을 구하고 각 벡터들은 가장 가까이 있는 중심점이 속해있는 클러스터로 분류된다는 점이다. 이는 보로노이 다이어그램 알고리즘과 유사하다.
![](/assets/images/faiss-7.png)
쿼리가 발생했을 때 가장 가까운 중심점을 구한 뒤 그 클러스터에 속한 벡터들만 검색하게 된다.

#### IndexIVFFlat 예제

```python
import numpy
import faiss
from sentence_transformers import SentenceTransformer

# 임베딩 모델 초기화
model: SentenceTransformer = SentenceTransformer('bert-base-nli-mean-tokens')

# 사전에 임베딩된 벡터들을 불러온다.
for i in range(57):
    if i == 0:
        with open(f"sentence_embeddings/embeddings_{i}.npy", "rb") as fp:
            sentence_embeddings = numpy.load(fp)
    else:
        with open(f"sentence_embeddings/embeddings_{i}.npy", "rb") as fp:
            sentence_embeddings = numpy.append(
				sentence_embeddings,
				numpy.load(fp),
				axis=0
			 )

# 원본 텍스트파일도 불러온다.
with open("sentence_embeddings/sentences.txt") as fp:
	lines = fp.read().split("\n")

d = sentence_embeddings.shape[1]
nlist = 50 # 생성할 클러스터 갯수이다.

# IndexFlatL2를 기반으로 IVF 인덱스를 만들어낸다.
quantizer = faiss.IndexFlatL2(d)
index = faiss.IndexIVFFlat(quantizer, d, nlist)
# 학습이 필요하다. 여기서 클러스터링 작업이 이루어진다.
index.train(sentence_embeddings)
# 데이터셋 추가
index.add(sentence_embeddings)
# 검색
xq = model.encode(['someone sprints with a football'])
k = 4
D, I = index.search(xq, k)
# 결과 출력
count = 0
for i in I[0]:
    print(f'[{i}]: "{lines[i]}"\ndistance: {D[0][count]}')
    count += 1
``` 

IndexIVFFlat 검색 결과
- 쿼리 문장: `'someone sprints with a football'`
- 검색 시간: `0.00019400008022785187`

```
[4586]: "A group of football players is running in the field"
distance: 54.623779296875
[10252]: "A group of people playing football is running in the field"
distance: 54.853519439697266
[12465]: "Two groups of people are playing football"
distance: 57.35627365112305
[190]: "A person playing football is running past an official carrying a football"
distance: 57.90591812133789
``` 
검색 시간이 상당히 단축된것을 볼 수 있다. 예제용 데이터셋이 그렇게 크지 않아 검색 결과는 같지만, 데이터셋 구모가 증가하고 검색 결과로 요청한 문장 수가 많을수록 정확도는 낮아질 수 있다.

#### 제품 양자화(Product Quantization, PQ)
PQ는 벡터의 크기를 줄이기 위한 손실 압축 과정이다. PQ는 다음 세 단계를 거친다. 숫자는 예시를 들었다.

1. 원본 벡터(768차원)를 여러개의 하위 벡터(96차원 * 8개)로 쪼갠다.
2. 쪼개진 하위 벡터들에 대한 클러스터링을 수행한다. 이때 생성되는 클러스터들은 내부 클러스터, 즉 하위 벡터들의 유사도를 근사하는 클러스터로 IVF 과정에서 생성되는 외부 클러스터와는 다르다.
3. 클러스터링이 끝나면 하위 벡터들이 속한 중심점의 ID값(0 ~ 255)으로 원본 벡터를 다시 만든다.

이 과정이 끝나면 4바이트 부동소수점으로 이루어진 768차원이었던 원본 벡터가 1바이트 정수로 이루어진 8차원 벡터가 된다. 이는 메모리 사용량을 극적으로 줄이는 획기적인 알고리즘이며, IVF와 결합된 IndexIVFPQ는 대규모의 데이터셋을 운용하는 프로젝트에서 가장 많이 사용하는 인덱스 유형이다.
![](/assets/images/faiss-8.png)
**IVF**는 인접한 벡터끼리 묶어 검색 범위를 줄이는 방식으로 최적화했다면, **PQ**는 벡터 자체를 쪼개 근사하여 압축하는 것이다. 의미적으로 유사한 하위 벡터들이 가장 가까운 하나의 중심점 ID로 대체되는 과정에서 손실이 발생한다.
![](/assets/images/faiss-9.png)

#### IndexIVFQP 예제

```python
import numpy, time
import faiss
from sentence_transformers import SentenceTransformer

# 임베딩 모델 초기화
model: SentenceTransformer = SentenceTransformer('bert-base-nli-mean-tokens')

# 사전에 임베딩된 벡터들을 불러온다.
for i in range(57):
	if i == 0:
		with open(f"sentence_embeddings/embeddings_{i}.npy", "rb") as fp:
			sentence_embeddings = numpy.load(fp)
    else:
		with open(f"sentence_embeddings/embeddings_{i}.npy", "rb") as fp:
			sentence_embeddings = numpy.append(
				sentence_embeddings,
				numpy.load(fp),
				axis=0
			)

# 원본 텍스트파일도 불러온다.
with open("sentence_embeddings/sentences.txt") as fp:
	lines = fp.read().split("\n")

demensions = sentence_embeddings.shape[1]
nlist = 50 # 생성할 클러스터 갯수이다. 특 전체 벡터 공간을 50개로 쪼갠다는 의미다.
m = 8      # 분할할 하위 벡터의 수이다. 
bits = 8   # 하위 벡터 클러스터링에 있어 매핑할 센터로이드 ID의 비트수이다.
		   # 8이면 8비트 정수(0 ~ 255)범위의 ID로 매핑할것을 의미하며
		   # 하위 벡터들에 대한 클러스터 수는 256개가 된다.

# IndexFlatL2를 기반으로 IVFPQ 인덱스를 생성한다.
quantizer = faiss.IndexFlatL2(demensions)
index = faiss.IndexIVFPQ(quantizer, d, nlist, m, bits)
# 학습 및 데이터셋 추가
index.train(sentence_embeddings)
index.add(sentence_embeddings)
# 검색
xq = model.encode(['someone sprints with a football'])
k = 4
D, I = index.search(xq, k)
# 결과 출력.. IndexFlatL2와 같은 결과가 나오지만 훨씬 빠르다.
count = 0
for i in I[0]:
    print(f'{i}: {lines[i]} -- distance: {D[0][count]}')
    count += 1
```

IndexIVFQP 검색 결과
- 쿼리 문장: `'someone sprints with a football'`
- 검색 시간: `0.0001501000951975584`

```
[190]: "A person playing football is running past an official carrying a football"
distance: 68.10297393798828
[399]: "A football player kicks the ball."
distance: 68.10297393798828
[8328]: "A football player is running past an official carrying a football"
distance: 68.10297393798828
[12465]: "Two groups of people are playing football"
distance: 68.10297393798828
``` 

테스트 결과 정확도는 IVFFlat에 비해 감소한 모습을 보이나 유사도 검색으로서의 기능에는 큰 결함이 없는것으로 보인다. 또한 검색 결과로 출력된 거리 배열(D)의 내용들이, 개별 벡터에 대한 거리가 아닌 PQ에 의해 결정된 중심점과의 거리로 대체되었기 때문에 공통된 수치로 나타나는것을 볼 수 있다.

데이터셋 규모의 증가에 따른 검색 시간은 다음과 같은 증가세를 보인다.
![](/assets/images/faiss-10.png)

---

## II. FAISS chapter 2 - LSH, HNSW
>IVF만으로도 훌륭한 성능 최적화 결과를 보이지만 데이터 다양성과 수가 증가함에 따라 클러스터, 벡터들과
>무차별적인 순회를 처음부터 피한다면 최적의 이웃을 찾아가기 위한 시간 소모를 급격히 줄일 수 있다. 가장 먼저, 파이썬의 딕셔너리처럼 해시 컨테이너 기반의 자료구조를 떠올려볼 수 있다.

#### LSH(Locally Sensitive Hashing)
파이썬의 딕셔너리와 같이 일반적인 해싱 컨테이너는 데이터를 담을 **버킷(Bucket)** 의 충돌을 최소화하려고 한다.  반면 **LSH**는 일반적인 해싱 함수와 달리 유사한 키(Key)끼리의 충돌을 극대화하도록 설계된 해싱 함수이다.
![](/assets/images/faiss-11.png)
LSH는 유사한 키값끼리 최대한 같은 버킷 주소가 산출되도록 한다. 그로인해 마치 IVF처럼, 유사한 벡터끼리 그룹화할 수 있게 한다.
![](/assets/images/faiss-12.png)

#### IndexLSH 예제

```python
nbits = d*4 # 해시값의 해상도(비트 수)이다. 높을수록 정확도가 높아진다.
index = faiss.IndexLSH(d, nbits)
index.add(wb)
# and search
D, I = index.search(xq, k)
```

IndexLSH를 생성할 때 **nbits**라는 매개변수가 필요한데, 이는 해시값의 해상도를 의미한다. 해상도가 높다는 것은 많은 버킷을 생성할 수 있다는 의미이다.
![](/assets/images/faiss-13.png)
nbits가 클수록 높은 재현율(recall)을 보이는데, 재현율이란 LSH가 Flat과 비교했을떄 검색 결과가 얼마나 정확한지를 백분율로 나타낸것이다. 즉 nbits값이 높을수록 정확도가 증가한다.
![](/assets/images/faiss-14.png)
LSH의 치명적인 단점은 벡터의 차원이 클수록 nbits가 기하급수적으로 증가해 성능이 큰 폭으로 하락한다는 것이다. 성능 하락이 심해지면 Flat보다도 높은 검색 시간이 발생한다. 따라서 낮은 차원의 데이터셋을 운용할 때 높은 효율을 보이는 인덱스라고 할 수 있다.

#### HNSW(Hierarchical Navigable Small World Graphs)
**'계층적 작은 세계 그래프'**
페이스북이 개발한 차세대 인덱스이다. 최단 경로 알고리즘으로 개별 벡터들을 하나의 노드로 만들어 가장 인접한 이웃들끼리 연결한다.
![](/assets/images/faiss-15.png)
이때 연결을 계층적으로 연결하는것이 특징인데, 듬성듬성 떨어진 먼 노드들끼리의 긴 연결부터 시작하여 하위 계층으로 갈수록 짧고 조밀한 연결을 이루게 된다. 하위 레이어에서는 이전 레이어에서 연결되어있던 이웃 노드들을 제외하고 탐색한다.

```python
M = 64 # 경로 수
ef_construction = 64 # 구축 시 레이어 탐색 깊이
ef_search = 32       # 검색 시 레이어 탐색 깊이

index = faiss.IndexHNSWFlat(d, M)
index.hnsw.efConstruction = ef_construction
index.hnsw.efSearch = ef_search
```

매개변수 **M**은 이웃노드 수, 즉 그래프 구축 시 각 노드가 얼마나 많은 이웃노드들과 연결될 것인지를 결정하는 변수이다. M값의 증가에 따라 재현율이 증가한다.
![](/assets/images/faiss-17.png)
다만 메모리 사용량 역시 선형적으로 증가하므로 이를 염두에 두고 결정해야 한다.
![](/assets/images/faiss-18.png)

인덱스 생성 후에 정의하는 속성으로 `ef_construction`과 `ef_search`가 있는데, 이들이 가지는 정확한 의미는 다음과 같다.

- **efConstruction:** 인덱스 구축 또는 새 데이터를 추가할 때, 새로운 노드와 연결할 이웃 노드들을 얼마나 깊게 탐색할 지 결정하는 수치이다.
- **efSearch:** 인덱스에서 검색할 때, 최적의 이웃 노드를 얼마나 깊게 탐색할 지 결정하는 수치이다.

두 속성 모두 높을수록 검색 시 정확한 결과를 반환하지만 시간에 영향을 미친다.

|efConstruction|efSearch|
|-|-|
|데이터를 삽입할 때 사용|검색할 때 사용|
|구축 시간에 영향|검색 시간에 영향|

 HNSW의 가장 큰 장점은 바로 검색할 때 efSearch값을 조절하여 빠른 시간을 포기하는 대신 더 정확한 결과를 얻는 등 상충되는 두 요구사항을 필요에 맞게 조절할 수 있다는 점이다.
 ![](/assets/images/faiss-16.png)