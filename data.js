const DISTRICT_META = {
  CBD: {
    code: 'CBD',
    label: 'CBD',
    labelKo: '도심권',
    color: '#2f6fed',
    center: [37.5666, 126.9784],
    copy: '행정, 금융, 전통 상권이 결합된 코어 권역'
  },
  GBD: {
    code: 'GBD',
    label: 'GBD',
    labelKo: '강남권',
    color: '#02a77f',
    center: [37.5068, 127.0349],
    copy: '테크, 전문서비스, 신축 프라임 오피스 집중 권역'
  },
  YBD: {
    code: 'YBD',
    label: 'YBD',
    labelKo: '여의도권',
    color: '#f08a2f',
    center: [37.5265, 126.9243],
    copy: '금융기관과 대형 자본시장이 밀집한 권역'
  },
  ETC: {
    code: 'ETC',
    label: 'ETC',
    labelKo: '기타권역',
    color: '#778090',
    center: [37.5485, 126.9902],
    copy: '관찰 대상 확장 권역'
  }
};

const OWNER_POOL = {
  CBD: ['WRC Asset', 'Seoul Prime REIT', 'Han River Office Fund', 'Crown Property Trust'],
  GBD: ['Alpha Core Asset', 'Vista Institutional Partners', 'Metro Holdings', 'Axis Prime REIT'],
  YBD: ['Yeouido Capital Trust', 'Harbor Office REIT', 'BlueRiver Asset', 'Core Bridge Fund'],
  ETC: ['Urban Scope Fund', 'Anchor Asset Partners', 'SOW REIT', 'Northstar Property']
};

const TEASER_TYPES = [
  { key: 'transaction', label: '최근 거래금액', unit: '억원' },
  { key: 'noc', label: 'NOC', unit: '%' },
  { key: 'rent', label: '월 임대료', unit: '만원/3.3㎡' }
];

const CBD_SEEDS = [
  ['서울파이낸스센터', 'Seoul Finance Center', '중구 세종대로 136', 37.5676, 126.9788, 2001],
  ['더플라자타워', 'The Plaza Tower', '중구 소공로 119', 37.5658, 126.9797, 2002],
  ['센터원', 'Center 1', '중구 을지로 5길 26', 37.5664, 126.9845, 2010],
  ['페럼타워', 'Ferrum Tower', '중구 을지로 5길 19', 37.5669, 126.9832, 2011],
  ['D타워 돈의문', 'D Tower Donuimun', '종로구 통일로 134', 37.5724, 126.9695, 2020],
  ['종로타워', 'Jongno Tower', '종로구 종로 51', 37.5703, 126.9823, 1999],
  ['KT 광화문 EAST', 'KT Gwanghwamun East', '종로구 세종대로 178', 37.5732, 126.9752, 2003],
  ['그랑서울', 'Le Meilleur Jongno Town', '종로구 종로 33', 37.5706, 126.9816, 2014],
  ['시그니처타워', 'Signature Tower', '중구 청계천로 100', 37.5681, 126.9863, 2012],
  ['서울스퀘어', 'Seoul Square', '중구 한강대로 416', 37.5556, 126.9723, 1979],
  ['포스트타워', 'Post Tower', '중구 소공로 70', 37.5639, 126.9802, 2014],
  ['스테이트타워 남산', 'State Tower Namsan', '중구 퇴계로 100', 37.5601, 126.9878, 2015],
  ['SK서린빌딩', 'SK Seorin Building', '종로구 종로 26', 37.5711, 126.9796, 2014],
  ['삼성본관빌딩', 'Samsung Main Building', '중구 세종대로 67', 37.5650, 126.9772, 1984],
  ['을지로 프라임타워', 'Euljiro Prime Tower', '중구 을지로 66', 37.5660, 126.9904, 2019]
];

const GBD_SEEDS = [
  ['파르나스타워', 'Parnas Tower', '강남구 테헤란로 521', 37.5092, 127.0609, 2018],
  ['무역센터 트레이드타워', 'Trade Tower', '강남구 영동대로 511', 37.5102, 127.0587, 1988],
  ['강남파이낸스센터', 'Gangnam Finance Center', '강남구 테헤란로 152', 37.5003, 127.0360, 2001],
  ['아셈타워', 'ASEM Tower', '강남구 영동대로 517', 37.5130, 127.0597, 2000],
  ['포스코센터', 'POSCO Center', '강남구 테헤란로 440', 37.5054, 127.0552, 1995],
  ['센터필드 EAST', 'Centerfield East', '강남구 테헤란로 231', 37.5038, 127.0415, 2021],
  ['센터필드 WEST', 'Centerfield West', '강남구 테헤란로 231', 37.5031, 127.0410, 2021],
  ['강남 N타워', 'Gangnam N Tower', '강남구 테헤란로 129', 37.4984, 127.0316, 2017],
  ['GS타워 역삼', 'GS Tower Yeoksam', '강남구 논현로 508', 37.5010, 127.0378, 2015],
  ['르네상스타워', 'Renaissance Tower', '강남구 테헤란로 306', 37.5034, 127.0476, 2013],
  ['HJBC 타워', 'HJBC Tower', '강남구 봉은사로 207', 37.5072, 127.0348, 2016],
  ['미래에셋센터원 강남', 'Mirae Asset Gangnam', '강남구 테헤란로 418', 37.5050, 127.0531, 2020],
  ['삼성SDS 타워', 'Samsung SDS Tower', '강남구 테헤란로 211', 37.5018, 127.0402, 2019],
  ['테헤란로 센트럴', 'Teheran Central', '강남구 테헤란로 320', 37.5039, 127.0488, 2022],
  ['코엑스 오피스윙', 'COEX Office Wing', '강남구 영동대로 513', 37.5121, 127.0588, 2005]
];

const YBD_SEEDS = [
  ['IFC ONE', 'IFC One', '영등포구 국제금융로 10', 37.5252, 126.9245, 2012],
  ['IFC TWO', 'IFC Two', '영등포구 국제금융로 10', 37.5248, 126.9255, 2012],
  ['IFC THREE', 'IFC Three', '영등포구 국제금융로 10', 37.5240, 126.9260, 2012],
  ['파크원 타워1', 'Parc1 Tower 1', '영등포구 여의대로 108', 37.5264, 126.9283, 2020],
  ['파크원 타워2', 'Parc1 Tower 2', '영등포구 여의대로 108', 37.5261, 126.9273, 2020],
  ['TP타워', 'TP Tower', '영등포구 여의공원로 101', 37.5270, 126.9229, 2016],
  ['전경련회관', 'FKI Tower', '영등포구 여의대로 24', 37.5227, 126.9233, 2013],
  ['여의도 포스트타워', 'Yeouido Post Tower', '영등포구 여의나루로 60', 37.5219, 126.9252, 2019],
  ['KB금융타워', 'KB Financial Tower', '영등포구 국제금융로8길 26', 37.5224, 126.9297, 2018],
  ['NH금융타워', 'NH Financial Tower', '영등포구 국제금융로8길 15', 37.5232, 126.9287, 2017],
  ['브라이튼 여의도 오피스', 'Brighton Yeouido Office', '영등포구 국제금융로 39', 37.5237, 126.9219, 2023],
  ['여의도 미래빌딩', 'Yeouido Mirae Building', '영등포구 의사당대로 97', 37.5315, 126.9194, 2015],
  ['유진투자증권빌딩', 'Eugene Tower', '영등포구 국제금융로 24', 37.5275, 126.9239, 2011],
  ['콘래드 오피스윙', 'Conrad Office Wing', '영등포구 국제금융로 10', 37.5244, 126.9257, 2012],
  ['하버뷰타워', 'Harbor View Tower', '영등포구 여의공원로 111', 37.5282, 126.9218, 2021]
];

function buildBuildingRecord(seed, districtCode, districtIndex, globalIndex) {
  const [nameKo, nameEn, address, lat, lng, completionYear] = seed;
  const teaserType = TEASER_TYPES[globalIndex % TEASER_TYPES.length];
  const ownerList = OWNER_POOL[districtCode] || OWNER_POOL.ETC;
  const owner = ownerList[globalIndex % ownerList.length];

  const transactionPrice = 6200 + globalIndex * 180 + districtIndex * 140;
  const unitPrice = 195 + (globalIndex % 11) * 14;
  const noc = Number((7.1 + (globalIndex % 9) * 0.35).toFixed(1));
  const rent = Number((11.4 + (globalIndex % 10) * 0.55).toFixed(1));
  const mgmtFee = Number((3.4 + (globalIndex % 8) * 0.32).toFixed(1));

  const transactionYear = 2018 + (globalIndex % 8);
  const transactionMonth = String((globalIndex % 12) + 1).padStart(2, '0');
  const transactionDate = `${transactionYear}-${transactionMonth}-15`;

  let teaserValue = transactionPrice;
  if (teaserType.key === 'noc') teaserValue = noc;
  if (teaserType.key === 'rent') teaserValue = rent;

  return {
    id: `BLD-${String(globalIndex + 1).padStart(3, '0')}`,
    name_ko: nameKo,
    name_en: nameEn,
    district: districtCode,
    address,
    lat,
    lng,
    completion_date: `${completionYear}-01-01`,
    completion_year: completionYear,
    teaser: {
      key: teaserType.key,
      label: teaserType.label,
      value: teaserValue,
      unit: teaserType.unit
    },
    paid: {
      owner,
      transaction_price_100m_krw: transactionPrice,
      transaction_date: transactionDate,
      unit_price_per_pyeong_10000krw: unitPrice,
      NOC_percent: noc,
      rent_per_3_3sqm_10000krw: rent,
      mgmt_fee_per_3_3sqm_10000krw: mgmtFee,
      major_tenants: [
        `${districtCode} Capital`,
        `${nameEn.split(' ')[0]} Advisory`,
        'Prime Mobility Co.'
      ],
      architect: globalIndex % 2 === 0 ? 'SOM + Local Partner' : 'KPF + Local Partner',
      constructor: globalIndex % 3 === 0 ? 'Samsung C&T' : 'Hyundai E&C'
    },
    narrative_overview: `${nameKo}는 ${DISTRICT_META[districtCode].labelKo} 핵심 동선에 위치한 프라임 오피스입니다.`,
    narrative_architecture: `${completionYear}년 준공 이후 리뉴얼을 거쳐 로비 동선과 수직 이동 효율이 개선된 사례로 평가됩니다.`,
    narrative_value: `${transactionYear}년 이후 자본시장 변동 국면에서도 거래 관심이 유지되며, 권역 평균 대비 안정적인 가격 방어력을 보였습니다.`,
    narrative_rent: `NOC ${noc}% 수준에서 유지되고 있으며, 임대료와 관리비는 권역 평균 대비 ${globalIndex % 2 === 0 ? '보합' : '소폭 프리미엄'} 구간입니다.`
  };
}

function buildDistrictRecords(seeds, districtCode) {
  return seeds.map((seed, districtIndex) => ({ seed, districtCode, districtIndex }));
}

const rawSeedRecords = [
  ...buildDistrictRecords(CBD_SEEDS, 'CBD'),
  ...buildDistrictRecords(GBD_SEEDS, 'GBD'),
  ...buildDistrictRecords(YBD_SEEDS, 'YBD')
];

const BUILDINGS = rawSeedRecords.map((record, globalIndex) =>
  buildBuildingRecord(record.seed, record.districtCode, record.districtIndex, globalIndex)
);

const COMMUNITY_SEED_POSTS = [
  {
    id: 'post-seed-001',
    building_id: 'BLD-001',
    type: 'note',
    role: 'tenant',
    author_id: 'seed-user-1',
    content: '08:45~09:10 구간 로비 혼잡이 큽니다. 9시 이후 입장 권장.',
    helpful: 9,
    moderation_status: 'clean',
    created_at: '2026-02-15T08:40:00+09:00'
  },
  {
    id: 'post-seed-002',
    building_id: 'BLD-004',
    type: 'qna',
    role: 'broker',
    author_id: 'seed-user-2',
    content: '점심시간 상권이 한 블록 단위로 갈립니다. 북측 vs 남측 체감 있으신가요?',
    helpful: 6,
    moderation_status: 'clean',
    created_at: '2026-02-12T12:05:00+09:00'
  },
  {
    id: 'post-seed-003',
    building_id: 'BLD-010',
    type: 'note',
    role: 'facility',
    author_id: 'seed-user-3',
    content: '우천 시 지하 연결통로 이용률이 높아 엘리베이터 대기 2~3분 추가됩니다.',
    helpful: 8,
    moderation_status: 'clean',
    created_at: '2026-02-17T18:20:00+09:00'
  },
  {
    id: 'post-seed-004',
    building_id: 'BLD-016',
    type: 'note',
    role: 'visitor',
    author_id: 'seed-user-4',
    content: '테헤란로 방향 차량 하차 지점이 퇴근 시간대 혼잡합니다.',
    helpful: 5,
    moderation_status: 'clean',
    created_at: '2026-02-10T19:02:00+09:00'
  },
  {
    id: 'post-seed-005',
    building_id: 'BLD-021',
    type: 'qna',
    role: 'tenant',
    author_id: 'seed-user-5',
    content: '센터필드 인근 회의실 예약이 몰리는 시간대 공유 부탁드립니다.',
    helpful: 11,
    moderation_status: 'clean',
    created_at: '2026-02-14T11:50:00+09:00'
  },
  {
    id: 'post-seed-006',
    building_id: 'BLD-031',
    type: 'photo',
    role: 'visitor',
    author_id: 'seed-user-6',
    content: '여의도권 야간 접근성은 우수하지만 금요일 주차 동선은 혼잡합니다.',
    helpful: 7,
    moderation_status: 'clean',
    created_at: '2026-02-13T21:11:00+09:00'
  },
  {
    id: 'post-seed-007',
    building_id: 'BLD-036',
    type: 'note',
    role: 'broker',
    author_id: 'seed-user-7',
    content: '국제금융로 블록은 회의실 수요가 몰려 단기 임차 문의가 빠르게 소진됩니다.',
    helpful: 4,
    moderation_status: 'clean',
    created_at: '2026-02-16T09:30:00+09:00'
  },
  {
    id: 'post-seed-008',
    building_id: 'BLD-044',
    type: 'qna',
    role: 'facility',
    author_id: 'seed-user-8',
    content: '출입 게이트 유지보수 일정 공유가 필요한데 어디서 공지 받으시나요?',
    helpful: 3,
    moderation_status: 'clean',
    created_at: '2026-02-11T16:25:00+09:00'
  }
];

const ACCESS_MATRIX = {
  free: {
    map: true,
    teaser_3_metrics: true,
    building_full_detail: false,
    market_stats: false,
    compare_max_buildings: 0,
    community_daily_post_limit: 3,
    favorites_limit: 10,
    media_download: false
  },
  paid: {
    map: true,
    teaser_3_metrics: true,
    building_full_detail: true,
    market_stats: true,
    compare_max_buildings: 5,
    community_daily_post_limit: 30,
    favorites_limit: 100,
    media_download: 'rights-bound'
  },
  admin: {
    moderation: true,
    content_badge_control: true,
    rights_policy_management: true
  }
};

const RIGHTS_NOTICE = {
  status: 'pending_legal_confirmation',
  updated_at: '2026-02-18',
  notes: [
    '본사의 동의 없이 책의 글/사진/그림 재사용 불가',
    '사진 자유사용 기능은 라이선스 계약 체결 이후에만 제공',
    '권리 확정 전에는 썸네일/블러/열람 제한 정책 적용'
  ]
};

window.AppData = {
  BUILDINGS,
  DISTRICT_META,
  COMMUNITY_SEED_POSTS,
  ACCESS_MATRIX,
  RIGHTS_NOTICE,
  MAX_FREE_FAVORITES: 10,
  MAX_FREE_POSTS_PER_DAY: 3,
  MAX_COMPARE_FREE: 0,
  MAX_COMPARE_PAID: 5
};
