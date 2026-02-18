(function () {
const {
  BUILDINGS,
  DISTRICT_META,
  COMMUNITY_SEED_POSTS,
  ACCESS_MATRIX,
  RIGHTS_NOTICE,
  MAX_FREE_FAVORITES,
  MAX_FREE_POSTS_PER_DAY,
  MAX_COMPARE_PAID
} = window.AppData;

const STORAGE_KEYS = {
  paid: 'soi-paid-v1',
  favorites: 'soi-favorites-v1',
  community: 'soi-community-v1'
};

const ROLE_LABELS = {
  tenant: '임차인',
  visitor: '방문자',
  broker: '중개',
  facility: '시설'
};

const TYPE_LABELS = {
  note: 'Note',
  qna: 'QnA',
  photo: 'Photo'
};

const state = {
  activeTab: 'map',
  district: 'ALL',
  query: '',
  selectedBuildingId: BUILDINGS[0]?.id || null,
  detailTab: 'overview',
  isPaid: false,
  favorites: [],
  compareSelection: [],
  communityBuildingId: BUILDINGS[0]?.id || null,
  userPosts: []
};

const el = {};
let mapInstance = null;
let markerLayer = null;
let markerRegistry = new Map();
let toastTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  cacheDom();
  loadPersistedState();
  bindGlobalEvents();
  initMap();
  renderAll();
});

function cacheDom() {
  el.tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  el.pages = Array.from(document.querySelectorAll('.tab-page'));

  el.headerPlanBtn = document.getElementById('header-plan-btn');

  el.mapResultsMeta = document.getElementById('map-results-meta');
  el.mapSearchInput = document.getElementById('map-search-input');
  el.mapDistrictFilters = document.getElementById('map-district-filters');
  el.clearFiltersBtn = document.getElementById('clear-filters-btn');
  el.mapCards = document.getElementById('map-cards');

  el.exploreCollections = document.getElementById('explore-collections');
  el.exploreRanking = document.getElementById('explore-ranking');
  el.todayBuildingHero = document.getElementById('today-building-hero');
  el.comparePanel = document.getElementById('compare-panel');
  el.compareList = document.getElementById('compare-list');
  el.compareTableWrap = document.getElementById('compare-table-wrap');
  el.compareLock = document.getElementById('compare-lock');
  el.exploreOpenPaywall = document.getElementById('explore-open-paywall');
  el.compareUnlockBtn = document.getElementById('compare-unlock-btn');

  el.communityBuildingSelect = document.getElementById('community-building-select');
  el.communityThread = document.getElementById('community-thread');
  el.communityForm = document.getElementById('community-form');
  el.communityType = document.getElementById('community-type');
  el.communityRole = document.getElementById('community-role');
  el.communityContent = document.getElementById('community-content');
  el.communitySubmitNote = document.getElementById('community-submit-note');

  el.profilePlanStatus = document.getElementById('profile-plan-status');
  el.profilePlanCopy = document.getElementById('profile-plan-copy');
  el.profilePlanCta = document.getElementById('profile-plan-cta');
  el.favoritesList = document.getElementById('favorites-list');
  el.profileRightsStatus = document.getElementById('profile-rights-status');

  el.modalBackdrop = document.getElementById('modal-backdrop');
  el.detailSheet = document.getElementById('detail-sheet');
  el.detailClose = document.getElementById('detail-close');
  el.detailFavoriteBtn = document.getElementById('detail-favorite-btn');
  el.detailDistrict = document.getElementById('detail-district');
  el.detailName = document.getElementById('detail-name');
  el.detailSubline = document.getElementById('detail-subline');
  el.detailVisual = document.getElementById('detail-visual');
  el.detailFacts = document.getElementById('detail-facts');
  el.detailTabs = Array.from(document.querySelectorAll('.detail-tab'));
  el.detailTabContent = document.getElementById('detail-tab-content');
  el.detailCtaRow = document.getElementById('detail-cta-row');

  el.paywallModal = document.getElementById('paywall-modal');
  el.paywallClose = document.getElementById('paywall-close');
  el.paywallContext = document.getElementById('paywall-context');
  el.paywallSubscribe = document.getElementById('paywall-subscribe');
  el.paywallRestore = document.getElementById('paywall-restore');

  el.toast = document.getElementById('toast');
}

function loadPersistedState() {
  state.isPaid = localStorage.getItem(STORAGE_KEYS.paid) === 'true';

  try {
    const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]');
    if (Array.isArray(favorites)) state.favorites = favorites;
  } catch (error) {
    state.favorites = [];
  }

  try {
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.community) || '[]');
    if (Array.isArray(posts)) state.userPosts = posts;
  } catch (error) {
    state.userPosts = [];
  }

  if (!BUILDINGS.find((building) => building.id === state.selectedBuildingId)) {
    state.selectedBuildingId = BUILDINGS[0]?.id || null;
  }

  if (!BUILDINGS.find((building) => building.id === state.communityBuildingId)) {
    state.communityBuildingId = state.selectedBuildingId;
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEYS.paid, String(state.isPaid));
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(state.favorites));
  localStorage.setItem(STORAGE_KEYS.community, JSON.stringify(state.userPosts));
}

function bindGlobalEvents() {
  el.tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.tabTarget;
      if (target) setActiveTab(target);
    });
  });

  el.headerPlanBtn.addEventListener('click', () => {
    if (state.isPaid) {
      setActiveTab('profile');
      showToast('현재 Pro 플랜이 활성화되어 있습니다.');
      return;
    }
    openPaywall('현재 무료 플랜입니다. 비교/통계 기능은 Pro에서 제공됩니다.');
  });

  el.mapSearchInput.addEventListener('input', (event) => {
    state.query = event.target.value.trim();
    syncFilteredSelection();
    renderMapSection();
    renderExploreSection();
  });

  el.mapDistrictFilters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-district]');
    if (!button) return;
    state.district = button.dataset.district;
    syncFilteredSelection();
    renderMapSection();
    renderExploreSection();
  });

  el.clearFiltersBtn.addEventListener('click', () => {
    state.query = '';
    state.district = 'ALL';
    el.mapSearchInput.value = '';
    syncFilteredSelection();
    renderMapSection();
    renderExploreSection();
  });

  el.mapCards.addEventListener('click', (event) => {
    const card = event.target.closest('.map-card');
    if (!card) return;

    const buildingId = card.dataset.buildingId;
    if (!buildingId) return;

    if (event.target.matches('[data-action="open-detail"]')) {
      openDetail(buildingId);
      return;
    }

    if (event.target.matches('[data-action="toggle-favorite"]')) {
      toggleFavorite(buildingId);
      renderMapCards();
      renderProfileSection();
      return;
    }

    selectBuilding(buildingId, true);
  });

  el.exploreOpenPaywall.addEventListener('click', () => {
    openPaywall('권역 평균 대비 비교와 통계는 Pro에서 열립니다.');
  });

  el.compareUnlockBtn.addEventListener('click', () => {
    openPaywall('Pro Compare를 잠금 해제하면 최대 5개 빌딩 비교가 가능합니다.');
  });

  el.compareList.addEventListener('change', (event) => {
    const target = event.target;
    if (!target.matches('input[data-building-id]')) return;

    if (!state.isPaid) {
      target.checked = false;
      openPaywall('Free 플랜에서는 비교 기능이 잠겨 있습니다.');
      return;
    }

    const buildingId = target.dataset.buildingId;
    if (!buildingId) return;

    if (target.checked) {
      if (state.compareSelection.length >= MAX_COMPARE_PAID) {
        target.checked = false;
        showToast(`최대 ${MAX_COMPARE_PAID}개까지 선택할 수 있습니다.`);
        return;
      }
      state.compareSelection.push(buildingId);
    } else {
      state.compareSelection = state.compareSelection.filter((id) => id !== buildingId);
    }

    renderCompareTable();
  });

  el.communityBuildingSelect.addEventListener('change', (event) => {
    state.communityBuildingId = event.target.value;
    renderCommunityThread();
  });

  el.communityForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitCommunityPost();
  });

  el.communityThread.addEventListener('click', (event) => {
    const helpfulButton = event.target.closest('[data-action="helpful"]');
    if (helpfulButton) {
      const postId = helpfulButton.dataset.postId;
      incrementHelpful(postId);
      return;
    }

    const reportButton = event.target.closest('[data-action="report"]');
    if (reportButton) {
      const postId = reportButton.dataset.postId;
      reportPost(postId);
    }
  });

  el.profilePlanCta.addEventListener('click', () => {
    if (state.isPaid) {
      state.isPaid = false;
      state.compareSelection = [];
      persistState();
      renderAll();
      closePaywall();
      showToast('Pro 구독이 해지되었습니다.');
      return;
    }
    openPaywall('월 구독 1개 플랜으로 Full Detail을 바로 활성화할 수 있습니다.');
  });

  el.favoritesList.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-action="open-favorite"]');
    if (openButton) {
      const buildingId = openButton.dataset.buildingId;
      setActiveTab('map');
      selectBuilding(buildingId, true);
      openDetail(buildingId);
      return;
    }

    const removeButton = event.target.closest('[data-action="remove-favorite"]');
    if (removeButton) {
      toggleFavorite(removeButton.dataset.buildingId);
      renderMapCards();
      renderProfileSection();
    }
  });

  el.detailClose.addEventListener('click', closeDetail);
  el.detailFavoriteBtn.addEventListener('click', () => {
    if (!state.selectedBuildingId) return;
    toggleFavorite(state.selectedBuildingId);
    renderDetailSheet();
    renderMapCards();
    renderProfileSection();
  });

  el.detailTabs.forEach((button) => {
    button.addEventListener('click', () => {
      state.detailTab = button.dataset.detailTab;
      renderDetailTabs();
      renderDetailTabContent();
    });
  });

  el.detailCtaRow.addEventListener('click', (event) => {
    const unlock = event.target.closest('[data-action="open-paywall"]');
    if (unlock) {
      openPaywall('잠긴 거래/임대/소유/비교 데이터를 열어보세요.');
      return;
    }

    const communityJump = event.target.closest('[data-action="open-community"]');
    if (communityJump) {
      state.communityBuildingId = state.selectedBuildingId;
      setActiveTab('community');
      closeDetail();
      renderCommunitySection();
    }
  });

  el.modalBackdrop.addEventListener('click', () => {
    if (!el.paywallModal.classList.contains('hidden')) {
      closePaywall();
      return;
    }
    closeDetail();
  });

  el.paywallClose.addEventListener('click', closePaywall);
  el.paywallSubscribe.addEventListener('click', () => {
    state.isPaid = true;
    persistState();
    renderAll();
    closePaywall();
    showToast('Pro 플랜이 활성화되었습니다.');
  });
  el.paywallRestore.addEventListener('click', () => {
    state.isPaid = true;
    persistState();
    renderAll();
    closePaywall();
    showToast('구독 상태를 복원했습니다.');
  });
}

function initMap() {
  if (!window.L) {
    document.getElementById('map-canvas').innerHTML = '<p class="meta-note">지도를 불러오지 못했습니다.</p>';
    return;
  }

  mapInstance = L.map('map-canvas', {
    zoomControl: false,
    attributionControl: false,
    preferCanvas: true
  }).setView([37.5384, 126.9894], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 10
  }).addTo(mapInstance);

  if (window.L.markerClusterGroup) {
    markerLayer = L.markerClusterGroup({
      iconCreateFunction(cluster) {
        return L.divIcon({
          html: `<span class="cluster-pin">${cluster.getChildCount()}</span>`,
          className: '',
          iconSize: [40, 40]
        });
      }
    });
  } else {
    markerLayer = L.layerGroup();
  }

  mapInstance.addLayer(markerLayer);
}

function renderAll() {
  renderHeaderPlan();
  renderMapSection();
  renderExploreSection();
  renderCommunitySection();
  renderProfileSection();
  if (!el.detailSheet.classList.contains('hidden')) {
    renderDetailSheet();
  }
}

function renderHeaderPlan() {
  el.headerPlanBtn.textContent = state.isPaid ? 'Pro' : 'Free';
}

function setActiveTab(tabName) {
  state.activeTab = tabName;

  el.tabButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.tabTarget === tabName);
  });

  el.pages.forEach((page) => {
    page.classList.toggle('is-active', page.id === `tab-${tabName}`);
  });

  if (tabName === 'community') {
    renderCommunitySection();
  }

  if (tabName === 'map' && mapInstance) {
    window.requestAnimationFrame(() => mapInstance.invalidateSize());
  }
}

function getFilteredBuildings() {
  const query = state.query.toLowerCase();

  return BUILDINGS.filter((building) => {
    if (state.district !== 'ALL' && building.district !== state.district) return false;

    if (!query) return true;

    const source = [
      building.name_ko,
      building.name_en,
      building.address,
      building.district,
      DISTRICT_META[building.district]?.labelKo || ''
    ]
      .join(' ')
      .toLowerCase();

    return source.includes(query);
  });
}

function syncFilteredSelection() {
  const filtered = getFilteredBuildings();
  if (!filtered.length) {
    state.selectedBuildingId = null;
    return;
  }

  const exists = filtered.some((building) => building.id === state.selectedBuildingId);
  if (!exists) {
    state.selectedBuildingId = filtered[0].id;
  }
}

function renderMapSection() {
  renderDistrictFilterState();
  renderMapMeta();
  renderMapMarkers();
  renderMapCards();
}

function renderDistrictFilterState() {
  Array.from(el.mapDistrictFilters.querySelectorAll('button[data-district]')).forEach((button) => {
    button.classList.toggle('is-active', button.dataset.district === state.district);
  });
}

function renderMapMeta() {
  const filtered = getFilteredBuildings();
  const districtLabel = state.district === 'ALL' ? 'ALL DISTRICTS' : state.district;
  el.mapResultsMeta.textContent = `${districtLabel}. ${filtered.length} buildings visible.`;
}

function renderMapMarkers() {
  if (!mapInstance || !markerLayer) return;

  markerRegistry = new Map();
  markerLayer.clearLayers();

  const filtered = getFilteredBuildings();

  filtered.forEach((building) => {
    const markerColor = DISTRICT_META[building.district]?.color || DISTRICT_META.ETC.color;

    const marker = L.circleMarker([building.lat, building.lng], {
      radius: 8,
      color: '#fff',
      weight: 2,
      fillColor: markerColor,
      fillOpacity: 0.95
    });

    marker.bindTooltip(`${building.name_ko}`, {
      direction: 'top',
      offset: [0, -8]
    });

    marker.on('click', () => {
      selectBuilding(building.id, false);
      openDetail(building.id);
    });

    markerLayer.addLayer(marker);
    markerRegistry.set(building.id, marker);
  });

  if (filtered.length > 0) {
    const bounds = L.latLngBounds(filtered.map((building) => [building.lat, building.lng]));
    mapInstance.fitBounds(bounds.pad(0.2), { animate: false, maxZoom: 14 });
  }
}

function renderMapCards() {
  const filtered = getFilteredBuildings();

  if (!filtered.length) {
    el.mapCards.innerHTML = '<article class="map-card"><p class="sub-copy">조건에 맞는 빌딩이 없습니다.</p></article>';
    return;
  }

  el.mapCards.innerHTML = filtered
    .map((building) => {
      const isFavorite = state.favorites.includes(building.id);
      const isSelected = building.id === state.selectedBuildingId;
      return `
        <article class="map-card ${isSelected ? 'is-selected' : ''}" data-building-id="${building.id}">
          <div class="map-card-top">
            <div>
              <p class="metric-pill" style="color:${DISTRICT_META[building.district].color}">${building.district}</p>
              <h3>${escapeHtml(building.name_ko)}</h3>
            </div>
            <button class="ghost-btn" data-action="toggle-favorite">${isFavorite ? '★' : '☆'}</button>
          </div>
          <p class="sub-copy">${escapeHtml(building.name_en)}</p>
          <div class="map-card-meta">
            <p>위치: ${DISTRICT_META[building.district].labelKo} · ${escapeHtml(shortAddress(building.address))}</p>
            <p>준공: ${building.completion_year}</p>
            <p>${building.teaser.label}: <strong>${formatMetric(building.teaser.value, building.teaser.unit)}</strong></p>
          </div>
          <div class="card-actions">
            <button class="primary-btn" data-action="open-detail">상세 보기</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function selectBuilding(buildingId, centerMap) {
  state.selectedBuildingId = buildingId;
  state.communityBuildingId = buildingId;
  renderMapCards();

  if (centerMap && mapInstance) {
    const building = getBuildingById(buildingId);
    if (building) {
      mapInstance.panTo([building.lat, building.lng], { animate: true, duration: 0.4 });
    }
  }
}

function renderExploreSection() {
  renderCollections();
  renderRanking();
  renderTodayBuilding();
  renderCompareList();
  renderCompareTable();
  renderCompareLock();
}

function renderCollections() {
  const grouped = BUILDINGS.reduce((acc, building) => {
    acc[building.district] = acc[building.district] || [];
    acc[building.district].push(building);
    return acc;
  }, {});

  const districtCodes = ['CBD', 'GBD', 'YBD'];

  el.exploreCollections.innerHTML = districtCodes
    .map((districtCode) => {
      const districtBuildings = grouped[districtCode] || [];
      const avgRent = average(districtBuildings.map((building) => building.paid.rent_per_3_3sqm_10000krw));

      return `
        <article class="collection-card">
          <strong style="color:${DISTRICT_META[districtCode].color}">${districtCode}</strong>
          <p class="sub-copy">${DISTRICT_META[districtCode].copy}</p>
          <p class="meta-note">${districtBuildings.length} buildings · 평균 임대료 ${avgRent.toFixed(1)}만원/3.3㎡</p>
        </article>
      `;
    })
    .join('');
}

function renderRanking() {
  const ranked = [...BUILDINGS]
    .sort((a, b) => b.paid.transaction_price_100m_krw - a.paid.transaction_price_100m_krw)
    .slice(0, 8);

  el.exploreRanking.innerHTML = ranked
    .map((building, index) => {
      return `
        <article class="insight-item">
          <span class="rank-badge">${index + 1}</span>
          <div>
            <strong>${escapeHtml(building.name_ko)}</strong>
            <p class="meta-note">${building.district} · ${building.completion_year}</p>
          </div>
          <span>${formatEok(building.paid.transaction_price_100m_krw)}</span>
        </article>
      `;
    })
    .join('');
}

function renderTodayBuilding() {
  const daySeed = Number(new Date().toISOString().slice(8, 10));
  const building = BUILDINGS[daySeed % BUILDINGS.length];

  el.todayBuildingHero.innerHTML = `
    <p class="eyebrow">TODAY'S BUILDING</p>
    <h3>${escapeHtml(building.name_ko)}</h3>
    <p>${escapeHtml(building.narrative_overview)}</p>
    <p class="meta-note">${building.district} · ${formatEok(building.paid.transaction_price_100m_krw)} · NOC ${building.paid.NOC_percent}%</p>
    <button class="ghost-btn" data-action="open-today-building" data-building-id="${building.id}">자세히 보기</button>
  `;

  const openButton = el.todayBuildingHero.querySelector('[data-action="open-today-building"]');
  openButton.addEventListener('click', () => {
    setActiveTab('map');
    selectBuilding(building.id, true);
    openDetail(building.id);
  });
}

function renderCompareList() {
  const compareCandidates = [...BUILDINGS]
    .sort((a, b) => b.paid.transaction_price_100m_krw - a.paid.transaction_price_100m_krw)
    .slice(0, 15);

  if (!state.isPaid) {
    state.compareSelection = [];
  }

  el.compareList.innerHTML = compareCandidates
    .map((building) => {
      const checked = state.compareSelection.includes(building.id);
      const disabled = state.isPaid ? '' : 'disabled';

      return `
        <label class="compare-option">
          <span>${escapeHtml(building.name_ko)} <small class="meta-note">${building.district}</small></span>
          <input type="checkbox" data-building-id="${building.id}" ${checked ? 'checked' : ''} ${disabled}>
        </label>
      `;
    })
    .join('');
}

function renderCompareTable() {
  if (!state.isPaid) {
    el.compareTableWrap.innerHTML = '';
    return;
  }

  const selected = state.compareSelection
    .map((id) => getBuildingById(id))
    .filter(Boolean);

  if (!selected.length) {
    el.compareTableWrap.innerHTML = '<p class="meta-note">비교할 빌딩을 선택해 주세요.</p>';
    return;
  }

  const districtAverages = calculateDistrictAverages();

  const headCells = selected.map((building) => `<th>${escapeHtml(building.name_ko)}</th>`).join('');

  const rows = [
    {
      label: '거래금액',
      value: (building) => formatEok(building.paid.transaction_price_100m_krw)
    },
    {
      label: 'NOC',
      value: (building) => `${building.paid.NOC_percent}%`
    },
    {
      label: '임대료',
      value: (building) => `${building.paid.rent_per_3_3sqm_10000krw}만원`
    },
    {
      label: '관리비',
      value: (building) => `${building.paid.mgmt_fee_per_3_3sqm_10000krw}만원`
    },
    {
      label: '권역 평균 대비 임대료',
      value: (building) => {
        const avg = districtAverages[building.district].rent;
        const delta = building.paid.rent_per_3_3sqm_10000krw - avg;
        return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}만원`;
      }
    }
  ];

  const rowMarkup = rows
    .map((row) => {
      const cells = selected.map((building) => `<td>${row.value(building)}</td>`).join('');
      return `<tr><th>${row.label}</th>${cells}</tr>`;
    })
    .join('');

  el.compareTableWrap.innerHTML = `
    <table class="compare-table">
      <thead>
        <tr>
          <th>항목</th>
          ${headCells}
        </tr>
      </thead>
      <tbody>${rowMarkup}</tbody>
    </table>
  `;
}

function renderCompareLock() {
  el.compareLock.classList.toggle('hidden', state.isPaid);
}

function renderCommunitySection() {
  renderCommunityBuildingSelect();
  renderCommunityThread();
  renderCommunitySubmitHint();
}

function renderCommunityBuildingSelect() {
  const options = BUILDINGS.map((building) => {
    const selected = building.id === state.communityBuildingId ? 'selected' : '';
    return `<option value="${building.id}" ${selected}>${escapeHtml(building.name_ko)} (${building.district})</option>`;
  });

  el.communityBuildingSelect.innerHTML = options.join('');
}

function renderCommunityThread() {
  const building = getBuildingById(state.communityBuildingId);
  if (!building) {
    el.communityThread.innerHTML = '<article class="thread-item"><p class="meta-note">빌딩을 선택해 주세요.</p></article>';
    return;
  }

  const allPosts = getMergedPosts(state.communityBuildingId);

  el.communityThread.innerHTML = allPosts
    .map((post) => {
      const timeLabel = formatRelativeTime(post.created_at);
      const hasModerationFlag = post.moderation_status === 'reported';

      return `
        <article class="thread-item ${hasModerationFlag ? 'is-reported' : ''}">
          <div class="thread-head">
            <div class="thread-badges">
              <span class="badge">${TYPE_LABELS[post.type] || 'Note'}</span>
              <span class="badge">${ROLE_LABELS[post.role] || '사용자'}</span>
              ${post.isWrc ? '<span class="badge wrc">WRC 데이터</span>' : ''}
            </div>
            <span class="meta-note">${timeLabel}</span>
          </div>
          <p>${escapeHtml(post.content)}</p>
          <div class="thread-actions">
            <button class="ghost-btn" data-action="helpful" data-post-id="${post.id}" ${post.isWrc ? 'disabled' : ''}>Helpful (${post.helpful || 0})</button>
            <button class="ghost-btn" data-action="report" data-post-id="${post.id}" ${post.isWrc ? 'disabled' : ''}>신고</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function getMergedPosts(buildingId) {
  const wrcPost = buildWrcInsightPost(buildingId);

  const sourcePosts = [...COMMUNITY_SEED_POSTS, ...state.userPosts]
    .filter((post) => post.building_id === buildingId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return [wrcPost, ...sourcePosts];
}

function buildWrcInsightPost(buildingId) {
  const building = getBuildingById(buildingId);
  return {
    id: `wrc-${buildingId}`,
    building_id: buildingId,
    type: 'note',
    role: 'broker',
    content: `${building.teaser.label} ${formatMetric(building.teaser.value, building.teaser.unit)} · NOC ${building.paid.NOC_percent}% · 임대료 ${building.paid.rent_per_3_3sqm_10000krw}만원/3.3㎡`,
    helpful: 0,
    moderation_status: 'clean',
    created_at: new Date().toISOString(),
    isWrc: true
  };
}

function renderCommunitySubmitHint() {
  const todayCount = getTodayUserPostCount();
  if (state.isPaid) {
    el.communitySubmitNote.textContent = `Pro 플랜: 오늘 ${todayCount}개 작성`;
    return;
  }

  el.communitySubmitNote.textContent = `Free 플랜: 오늘 ${todayCount}/${MAX_FREE_POSTS_PER_DAY}개 작성`;
}

function submitCommunityPost() {
  const content = el.communityContent.value.trim();
  if (!content) {
    showToast('내용을 입력해 주세요.');
    return;
  }

  if (!state.communityBuildingId) {
    showToast('빌딩을 먼저 선택해 주세요.');
    return;
  }

  if (!state.isPaid && getTodayUserPostCount() >= MAX_FREE_POSTS_PER_DAY) {
    showToast(`Free 플랜은 하루 ${MAX_FREE_POSTS_PER_DAY}개까지 작성할 수 있습니다.`);
    return;
  }

  const newPost = {
    id: `post-user-${Date.now()}`,
    building_id: state.communityBuildingId,
    type: el.communityType.value,
    role: el.communityRole.value,
    author_id: 'local-user',
    content,
    helpful: 0,
    moderation_status: 'clean',
    created_at: new Date().toISOString()
  };

  state.userPosts.unshift(newPost);
  persistState();

  el.communityContent.value = '';
  renderCommunityThread();
  renderCommunitySubmitHint();
  showToast('스레드에 등록했습니다.');
}

function incrementHelpful(postId) {
  const target = state.userPosts.find((post) => post.id === postId)
    || COMMUNITY_SEED_POSTS.find((post) => post.id === postId);

  if (!target) return;
  target.helpful = (target.helpful || 0) + 1;

  if (state.userPosts.find((post) => post.id === postId)) {
    persistState();
  }

  renderCommunityThread();
}

function reportPost(postId) {
  const target = state.userPosts.find((post) => post.id === postId)
    || COMMUNITY_SEED_POSTS.find((post) => post.id === postId);

  if (!target) return;
  target.moderation_status = 'reported';

  if (state.userPosts.find((post) => post.id === postId)) {
    persistState();
  }

  renderCommunityThread();
  showToast('신고가 접수되었습니다.');
}

function renderProfileSection() {
  renderPlanCard();
  renderFavorites();
  el.profileRightsStatus.textContent = RIGHTS_NOTICE.status === 'pending_legal_confirmation'
    ? '법무/권리 확정 후 확정'
    : '권리 확정 완료';
}

function renderPlanCard() {
  el.profilePlanStatus.textContent = state.isPaid ? 'Pro Plan' : 'Free Plan';

  if (state.isPaid) {
    el.profilePlanCopy.textContent = '통계/비교/Full Detail/확장 미디어 접근 활성화';
    el.profilePlanCta.textContent = '구독 해지';
    return;
  }

  el.profilePlanCopy.textContent = '지도 + 3개 지표 + 커뮤니티 기본 기능';
  el.profilePlanCta.textContent = 'Pro 시작';
}

function renderFavorites() {
  if (!state.favorites.length) {
    el.favoritesList.innerHTML = '<p class="meta-note">아직 즐겨찾기한 빌딩이 없습니다.</p>';
    return;
  }

  el.favoritesList.innerHTML = state.favorites
    .map((buildingId) => getBuildingById(buildingId))
    .filter(Boolean)
    .map((building) => {
      return `
        <article class="favorite-item">
          <div>
            <strong>${escapeHtml(building.name_ko)}</strong>
            <p class="meta-note">${building.district} · ${escapeHtml(shortAddress(building.address))}</p>
          </div>
          <div class="thread-actions">
            <button class="ghost-btn" data-action="open-favorite" data-building-id="${building.id}">열기</button>
            <button class="ghost-btn" data-action="remove-favorite" data-building-id="${building.id}">삭제</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function openDetail(buildingId) {
  const building = getBuildingById(buildingId);
  if (!building) return;

  state.selectedBuildingId = buildingId;
  state.detailTab = 'overview';

  renderDetailSheet();

  el.detailSheet.classList.remove('hidden');
  showBackdrop();
}

function closeDetail() {
  el.detailSheet.classList.add('hidden');
  hideBackdropIfNeeded();
}

function renderDetailSheet() {
  const building = getBuildingById(state.selectedBuildingId);
  if (!building) return;

  const district = DISTRICT_META[building.district];
  const isFavorite = state.favorites.includes(building.id);

  el.detailDistrict.textContent = `${district.label} · ${district.labelKo}`;
  el.detailName.textContent = building.name_ko;
  el.detailSubline.textContent = `${building.name_en} · ${shortAddress(building.address)}`;
  el.detailVisual.textContent = RIGHTS_NOTICE.status === 'pending_legal_confirmation'
    ? 'LICENSE PENDING · PREVIEW ONLY'
    : 'HI-RES MEDIA AVAILABLE';
  el.detailFavoriteBtn.textContent = isFavorite ? '★' : '☆';

  const facts = [
    { label: '권역 + 주소', value: `${building.district} · ${shortAddress(building.address)}` },
    { label: '준공연도', value: `${building.completion_year}` },
    { label: building.teaser.label, value: formatMetric(building.teaser.value, building.teaser.unit) }
  ];

  const paidFacts = [
    { label: '소유자', value: building.paid.owner },
    { label: '거래시기', value: building.paid.transaction_date },
    { label: '평당 단가', value: `${building.paid.unit_price_per_pyeong_10000krw}만원` },
    { label: '관리비', value: `${building.paid.mgmt_fee_per_3_3sqm_10000krw}만원` }
  ];

  const mergedFacts = state.isPaid
    ? [...facts, ...paidFacts]
    : [...facts, ...paidFacts.map((fact) => ({ ...fact, value: '잠금됨', locked: true }))];

  el.detailFacts.innerHTML = mergedFacts
    .map((fact) => {
      return `
        <div class="fact-item ${fact.locked ? 'locked' : ''}">
          <strong>${escapeHtml(fact.label)}</strong>
          <span>${escapeHtml(fact.value)}</span>
        </div>
      `;
    })
    .join('');

  renderDetailTabs();
  renderDetailTabContent();
  renderDetailCta();
}

function renderDetailTabs() {
  el.detailTabs.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.detailTab === state.detailTab);
  });
}

function renderDetailTabContent() {
  const building = getBuildingById(state.selectedBuildingId);
  if (!building) return;

  let html = '';

  if (state.detailTab === 'overview') {
    html = `
      <p>${escapeHtml(building.narrative_overview)}</p>
      <ul>
        <li>거래금액: ${state.isPaid ? formatEok(building.paid.transaction_price_100m_krw) : '잠금됨'}</li>
        <li>NOC: ${state.isPaid ? `${building.paid.NOC_percent}%` : '잠금됨'}</li>
        <li>주요 임차: ${state.isPaid ? escapeHtml(building.paid.major_tenants.join(', ')) : '잠금됨'}</li>
      </ul>
    `;
  }

  if (state.detailTab === 'architecture') {
    html = `
      <p>${escapeHtml(building.narrative_architecture)}</p>
      <ul>
        <li>설계: ${state.isPaid ? escapeHtml(building.paid.architect) : '잠금됨'}</li>
        <li>시공: ${state.isPaid ? escapeHtml(building.paid.constructor) : '잠금됨'}</li>
      </ul>
    `;
  }

  if (state.detailTab === 'value') {
    html = state.isPaid
      ? `
        <p>${escapeHtml(building.narrative_value)}</p>
        <ul>
          <li>거래금액: ${formatEok(building.paid.transaction_price_100m_krw)}</li>
          <li>거래시기: ${building.paid.transaction_date}</li>
          <li>평당 단가: ${building.paid.unit_price_per_pyeong_10000krw}만원</li>
        </ul>
      `
      : '<p>Value 섹션은 Pro에서 열립니다. 거래금액/거래시기/평당단가 비교 데이터를 확인하세요.</p>';
  }

  if (state.detailTab === 'rent') {
    html = state.isPaid
      ? `
        <p>${escapeHtml(building.narrative_rent)}</p>
        <ul>
          <li>NOC: ${building.paid.NOC_percent}%</li>
          <li>임대료: ${building.paid.rent_per_3_3sqm_10000krw}만원/3.3㎡</li>
          <li>관리비: ${building.paid.mgmt_fee_per_3_3sqm_10000krw}만원/3.3㎡</li>
        </ul>
      `
      : '<p>Rent 섹션은 Pro에서 열립니다. 임대료/관리비/권역 평균 대비 비교를 확인하세요.</p>';
  }

  if (state.detailTab === 'community') {
    const relatedPosts = getMergedPosts(building.id).slice(0, 3);
    const postItems = relatedPosts
      .map((post) => `<li>${escapeHtml(post.content)}</li>`)
      .join('');

    html = `
      <p>이 빌딩의 최근 스레드 요약입니다.</p>
      <ul>${postItems}</ul>
      <p class="meta-note">Community 탭에서 전체 대화와 QnA를 확인하세요.</p>
    `;
  }

  el.detailTabContent.innerHTML = html;
}

function renderDetailCta() {
  if (state.isPaid) {
    el.detailCtaRow.innerHTML = `
      <button class="primary-btn" data-action="open-community">건물 커뮤니티 열기</button>
    `;
    return;
  }

  el.detailCtaRow.innerHTML = `
    <button class="primary-btn" data-action="open-paywall">비교와 통계가 필요할 때 열리는 정보</button>
    <button class="ghost-btn" data-action="open-community">커뮤니티만 먼저 보기</button>
  `;
}

function openPaywall(contextText) {
  el.paywallContext.textContent = contextText;
  el.paywallModal.classList.remove('hidden');
  showBackdrop();
}

function closePaywall() {
  el.paywallModal.classList.add('hidden');
  hideBackdropIfNeeded();
}

function showBackdrop() {
  el.modalBackdrop.classList.remove('hidden');
}

function hideBackdropIfNeeded() {
  const isDetailOpen = !el.detailSheet.classList.contains('hidden');
  const isPaywallOpen = !el.paywallModal.classList.contains('hidden');
  if (!isDetailOpen && !isPaywallOpen) {
    el.modalBackdrop.classList.add('hidden');
  }
}

function toggleFavorite(buildingId) {
  const hasFavorite = state.favorites.includes(buildingId);

  if (hasFavorite) {
    state.favorites = state.favorites.filter((id) => id !== buildingId);
    persistState();
    showToast('즐겨찾기에서 제거했습니다.');
    return;
  }

  const maxFavorites = state.isPaid ? ACCESS_MATRIX.paid.favorites_limit : MAX_FREE_FAVORITES;
  if (state.favorites.length >= maxFavorites) {
    showToast(`즐겨찾기 한도(${maxFavorites}개)를 초과했습니다.`);
    return;
  }

  state.favorites.push(buildingId);
  persistState();
  showToast('즐겨찾기에 추가했습니다.');
}

function calculateDistrictAverages() {
  const result = {};

  ['CBD', 'GBD', 'YBD'].forEach((district) => {
    const districtBuildings = BUILDINGS.filter((building) => building.district === district);

    result[district] = {
      rent: average(districtBuildings.map((building) => building.paid.rent_per_3_3sqm_10000krw)),
      noc: average(districtBuildings.map((building) => building.paid.NOC_percent)),
      mgmt: average(districtBuildings.map((building) => building.paid.mgmt_fee_per_3_3sqm_10000krw))
    };
  });

  return result;
}

function getTodayUserPostCount() {
  const now = new Date();
  return state.userPosts.filter((post) => {
    const created = new Date(post.created_at);
    return created.getFullYear() === now.getFullYear()
      && created.getMonth() === now.getMonth()
      && created.getDate() === now.getDate();
  }).length;
}

function getBuildingById(buildingId) {
  return BUILDINGS.find((building) => building.id === buildingId) || null;
}

function average(values) {
  if (!values.length) return 0;
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function shortAddress(address) {
  return address.split(' ').slice(0, 3).join(' ');
}

function formatMetric(value, unit) {
  if (unit === '억원') return formatEok(Number(value));
  if (unit === '%') return `${value}%`;
  if (unit === '만원/3.3㎡') return `${value}만원`;
  return `${value}${unit || ''}`;
}

function formatEok(value) {
  if (!Number.isFinite(value)) return '-';
  if (value >= 10000) {
    return `${(value / 10000).toFixed(2)}조원`;
  }
  return `${value.toLocaleString('ko-KR')}억원`;
}

function formatRelativeTime(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}일 전`;
  return new Date(isoString).toLocaleDateString('ko-KR');
}

function showToast(message) {
  clearTimeout(toastTimer);
  el.toast.textContent = message;
  el.toast.classList.remove('hidden');

  toastTimer = window.setTimeout(() => {
    el.toast.classList.add('hidden');
  }, 1800);
}

function escapeHtml(raw) {
  return String(raw)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

})();
