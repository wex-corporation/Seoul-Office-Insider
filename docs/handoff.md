# Seoul Office Insider - Antigravity Handoff

## 1) Pages and routing
- `/` -> Bottom tab shell
- `tab-map` -> Map (search, district filter, map pins, swipe cards)
- `tab-explore` -> Collections, rankings, today building, Pro compare
- `tab-community` -> Building thread, post creation, moderation actions
- `tab-profile` -> Plan status, favorites, rights/legal policy
- Overlay route states
- `detail-sheet` -> Building detail sections (`overview`, `architecture`, `value`, `rent`, `community`)
- `paywall-modal` -> Subscription conversion and restore flow

## 2) Components
- `BuildingCard`
- `PinMarker + Cluster`
- `MetricChip`
- `PaywallModal`
- `CommunityPost`
- `DetailFactItem`
- `DistrictCollectionCard`
- `RankingInsightItem`
- `CompareTable`

## 3) Data schema (minimum)
- `building`
- `id`, `name_ko`, `name_en`, `address`, `district`, `lat`, `lng`
- `completion_date`, `completion_year`, `teaser{key,label,value,unit}`
- `paid.owner`, `paid.transaction_price_100m_krw`, `paid.transaction_date`, `paid.unit_price_per_pyeong_10000krw`
- `paid.NOC_percent`, `paid.rent_per_3_3sqm_10000krw`, `paid.mgmt_fee_per_3_3sqm_10000krw`
- `paid.major_tenants[]`, `paid.architect`, `paid.constructor`
- `narrative_overview`, `narrative_architecture`, `narrative_value`, `narrative_rent`
- `community_post`
- `id`, `building_id`, `type(note|qna|photo)`, `role(tenant|visitor|broker|facility)`
- `author_id`, `content`, `helpful`, `moderation_status(clean|reported)`, `created_at`

## 4) Permission matrix
- `Free`
- Map exploration
- Building card + 3 teaser metrics
- Community read/write with daily post cap (3)
- Favorites cap (10)
- No full detail, no compare stats, no media download
- `Paid`
- Full detail tabs + full metrics
- Compare up to 5 buildings + district benchmark
- Market-stat style insights enabled
- Higher favorites/post limit
- Media access only within rights-bound policy
- `Admin`
- Moderation controls
- Rights policy status management
- Data badge governance (`WRC data`)

## 5) Payment flow (single monthly subscription)
1. User taps locked item (`detail` or `compare`) -> opens paywall modal
2. Paywall shows benefit context + package blocks
3. `월 구독 시작` -> subscription state activates (`isPaid=true`)
4. UI immediately unlocks full detail + compare + stats
5. `구독 복원` path sets paid state from purchase history
6. `Profile` allows cancellation (`isPaid=false`) and reverts locked UI

## 6) Copy tone guide (Apple-ad style)
- Short, restrained lines
- Minimal adjectives, stronger nouns and numbers
- Example lines
- `GBD. 3 buildings near you.`
- `Rent, traded, and told as a story.`
- `Unlock comparison.`
- CTA tone
- Avoid hype-heavy phrases like `all unlocked forever`
- Prefer `비교와 통계가 필요할 때 열리는 정보`

## Legal and rights note
- Current status is `법무/권리 확정 후 확정`
- Photo "free reuse" must not be enabled unless license scope is contractually confirmed.

## 7) Growth and trust features added
- Analytics hooks: PostHog events (`tab`, `detail`, `paywall`, `community`, `subscription`) via `/Users/shchoi/Documents/Seoul-Office-Insider/config.js`
- Error monitoring hooks: Sentry capture for runtime errors and unhandled rejections
- Compare UX: table + district-average delta bars
- Community trust: new-user posting guardrail, report-count auto-hide, role badge verification request flow
