# Monklap 배포 인계 (Cursor / 로컬 Claude Code 용)

저장소 `GREATOH19/andy-oh-portfolio`, 브랜치 `claude/confident-shannon-50m2jg`, PR [#1](https://github.com/GREATOH19/andy-oh-portfolio/pull/1) (열림, 머지 안 함).
이 문서는 클라우드 세션에서 하던 작업을 로컬(Cursor)에서 이어가기 위한 메모예요. 첫 메시지로 "inbox/monklap/HANDOFF.md 읽고 이어서 진행해줘"라고 하면 돼요.

## 목표
Andy Oh 포트폴리오(Next.js `web/` + Sanity Studio 루트)에 Monklap 프로젝트 페이지를 실제로 배포한다.
사용자는 "기존 Sanity의 Monklap 내용을 이 초안으로 교체해도 된다, 다시 묻지 않아도 된다"고 승인했다.

## 브랜치에 이미 있는 것
| 파일 | 설명 |
| --- | --- |
| `web/public/monklap/index.html` | Monklap 정적 초안 (자리표시자 이미지, `noindex`). `web/next.config.ts` 리라이트로 `/monklap`에서 열림 |
| `inbox/monklap/index.html` | 위 파일의 원본 복사본 |
| `scripts/seed-monklap-draft.mjs` | Sanity 시드 스크립트 (아래 참고) |
| `package.json` | `seed:monklap-draft`, `seed:monklap-replace` 스크립트 |
| `.gitignore` | `/.backups` 추가 |

`next.config.ts`에는 `/monklap` → `/monklap/index.html` 리라이트만 있다. `/projects/monklap` 덮어쓰기 리라이트는 Sanity 방식으로 가면서 **제거했다**.

## Sanity 시드 스크립트
프로젝트 `sttir3vc`, dataset `production`. 발표 자료 내용으로 intro + story 16블록을 만든다. 이미지/영상은 **새로 업로드하지 않고** 이미 dataset에 있는 에셋 ID 17개(이미지 16, 영상 1)를 재사용한다. 에셋이 하나라도 없으면 아무것도 쓰지 않고 멈춘다.

- `npm run seed:monklap-draft` → `drafts.project-monklap-draft` (slug `monklap-draft`) 새 초안. 기존 문서는 안 건드림.
- `npm run seed:monklap-replace` → 라이브 `project-monklap`의 **소개+스토리만 교체**. 제목, 슬러그, 카드 썸네일, 히어로, 정렬 순서는 유지. 교체 전에 `.backups/project-monklap.<시각>.json`으로 백업하고, 대기 중인 `drafts.project-monklap`이 있으면 같이 삭제(백업에 포함).
- 인증: 로컬에서는 Sanity CLI 로그인(`npx sanity login`)이 쓰인다. `SANITY_WRITE_TOKEN`(Editor)이 있으면 토큰으로 동작.
- 스크립트의 문서 구조(블록 타입, 키 중복 없음, 에셋 참조)는 가짜 클라이언트로만 검증했다. **실제 Sanity/Studio 스키마 검증은 아직 안 해봤다.** 오류가 나면 그 메시지부터 확인.
- 기존 문서: `project-monklap`, slug `monklap`.

## 배포 경로와 알아낸 사실
- 실제 사이트 `andy-oh-portfolio.vercel.app`은 Vercel이 GitHub `main`에서 자동 배포한다. **PR #1 머지 = 실제 사이트 배포.** `/monklap` 초안 페이지가 노출되니, 머지 전에 `noindex`와 자리표시자 이미지를 어떻게 할지 결정할 것.
- Sanity 콘텐츠 교체는 사이트 코드 배포와 별개로 바로 라이브 콘텐츠에 반영된다.
- Vercel 프로젝트: `andy-oh-portfolio` (`prj_asmMBjcgxVgqYNAJztMKjjm9MQkS`), 계정 `greatoh19`(Hobby, `happyandy219@gmail.com`).
- Preview 환경에 `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`은 설정돼 있다 (Production + Preview). 나머지(Instagram, Resend, Meta, Cron 등)는 Production 전용.
- 이 브랜치의 프리뷰 빌드는 마지막 커밋 `4d48632`가 한 번 실패했고, **같은 커밋 재배포는 성공(READY)** 했다. 앞선 두 프리뷰도 성공. 실패는 일시적이었을 가능성이 크지만 빌드 로그를 못 읽어서 원인은 확정하지 못했다. 이후 커밋(`seed`/`package.json`/`next.config.ts` 변경)의 프리뷰 상태는 아직 확인 안 함. PR 체크가 갱신됐는지 확인할 것.
- 프리뷰 URL은 Vercel 로그인 보호가 걸려 302로 리다이렉트된다.

## 클라우드 세션에서 막혔던 것 (로컬에서는 해당 없음)
- Vercel 커넥터: `slug`/`teamId`를 지정하면 403. 지정 없이 호출하면 배포 상태 조회는 됨. 빌드 로그(`list_deployment_events`)는 계속 403이라 로그는 대시보드에서 확인해야 한다.
- 클라우드 환경에는 Sanity 쓰기 권한이 없어서 시드를 실행하지 못했다. 로컬에서 직접 실행하면 된다.
- `/projects/monklap` 덮어쓰기를 "실제 배포"로 분류하는 권한 규칙에 한 번 막혔다.

## 다른 브랜치 (미머지, 충돌 주의)
- `claude/monklap-project-page-h3lc5l`: `web/app/projects/monklap/page.tsx` 커스텀 React 라우트(`MonklapPage.tsx`)와 `web/public/monklap/*` 에셋 21개. **이 브랜치가 머지되면 정적 라우트가 `/projects/monklap`의 Sanity 콘텐츠를 가려서**, Sanity 교체가 사이트에 안 보일 수 있다. 어느 쪽을 쓸지 정할 것.
- `claude/optimistic-lamport-cy147m`: `inbox/` 기반 도구(`tools/`, `scripts/publish-project.mjs`, 인스타그램 캐러셀 스크립트). `inbox/monklap/brief.md`, 슬라이드 PDF 포함.

## 로컬에서 이어서 할 일 (순서)
1. 브랜치 체크아웃, 루트와 `web`에서 `npm ci`.
2. 루트에서 `npx sanity login` 후 `npm run seed:monklap-replace` 실행. `.backups/` 파일 생성 확인. 오류 나면 메시지 확인.
3. `npm run dev`(루트, Studio :3333)에서 Project → Monklap 확인. `cd web && npm run dev`(:3000)에서 `/projects/monklap` 확인. (`next.config.ts` 변경은 dev 서버 재시작 필요)
4. 다른 브랜치(`monklap-project-page`)와의 충돌 방침을 정한다.
5. 정적 `/monklap` 초안을 사이트에 남길지 결정한다. 안 남길 거면 `web/public/monklap/`와 `next.config.ts`의 리라이트를 PR에서 빼고, 남길 거면 `noindex`와 자리표시자 이미지 처리.
6. PR #1 체크(Vercel 프리뷰) 확인 → 머지(=실제 배포) → `andy-oh-portfolio.vercel.app/projects/monklap` 확인.

## 주의
- 토큰, API 키를 채팅에 붙여넣지 말 것.
- 코드 오류 없이 빌드가 실패하면 먼저 Vercel 대시보드의 빌드 로그 마지막 줄을 확인한다.
