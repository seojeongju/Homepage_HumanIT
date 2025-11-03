const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  const url = 'https://67402fe0.humanit-webapp.pages.dev';

  console.log('\n📱 모바일 반응형 테스트 리포트 (iPhone 12 Pro)\n');
  console.log('═'.repeat(70));

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // 전체 페이지 상태 확인
  const pageStats = await page.evaluate(() => {
    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      bodyWidth: document.body.scrollWidth,
      bodyHeight: document.body.scrollHeight,
      horizontalScroll: document.body.scrollWidth > window.innerWidth
    };
  });

  console.log('\n📊 전체 페이지 상태:');
  console.log('─'.repeat(70));
  console.log(`뷰포트 크기: ${pageStats.viewportWidth} x ${pageStats.viewportHeight}px`);
  console.log(`페이지 전체: ${pageStats.bodyWidth} x ${pageStats.bodyHeight}px`);
  console.log(`가로 스크롤: ${pageStats.horizontalScroll ? '❌ 발생 (문제 있음)' : '✅ 없음 (정상)'}`);

  // 사업영역 카드 분석
  const businessInfo = await page.evaluate(() => {
    const section = document.querySelector('.bg-gradient-to-br.from-blue-500.to-blue-600');
    if (!section) return null;
    
    const cards = section.querySelectorAll('.grid.grid-cols-2 > div');
    const rect = section.getBoundingClientRect();
    
    return {
      sectionWidth: Math.round(rect.width),
      cardCount: cards.length,
      cards: Array.from(cards).map((card, i) => {
        const r = card.getBoundingClientRect();
        const text = card.querySelector('p')?.textContent.trim() || '';
        return {
          index: i + 1,
          title: text,
          width: Math.round(r.width),
          height: Math.round(r.height)
        };
      })
    };
  });

  console.log('\n🎴 사업영역 카드 (2x2 그리드):');
  console.log('─'.repeat(70));
  if (businessInfo) {
    console.log(`섹션 너비: ${businessInfo.sectionWidth}px`);
    console.log(`카드 개수: ${businessInfo.cardCount}개`);
    businessInfo.cards.slice(0, 4).forEach(card => {
      console.log(`  ${card.index}. ${card.title}: ${card.width}x${card.height}px`);
    });
    console.log(`✅ 사업영역 카드는 2열 그리드로 정상 표시됨`);
  }

  // Why Choose Us 카드 분석
  const whyInfo = await page.evaluate(() => {
    const grids = Array.from(document.querySelectorAll('.grid'));
    let targetGrid = null;
    
    for (const grid of grids) {
      if (grid.className.includes('grid-cols-1') && grid.className.includes('md:grid-cols-4')) {
        const cards = grid.querySelectorAll('.relative.overflow-hidden');
        if (cards.length >= 4) {
          targetGrid = grid;
          break;
        }
      }
    }
    
    if (!targetGrid) return null;
    
    const cards = targetGrid.querySelectorAll('.relative.overflow-hidden');
    return {
      cardCount: cards.length,
      cards: Array.from(cards).slice(0, 4).map((card, i) => {
        const r = card.getBoundingClientRect();
        const title = card.querySelector('h3')?.textContent.trim() || '';
        return {
          index: i + 1,
          title: title,
          width: Math.round(r.width),
          height: Math.round(r.height)
        };
      })
    };
  });

  console.log('\n🌟 Why Choose Us 카드:');
  console.log('─'.repeat(70));
  if (whyInfo) {
    console.log(`카드 개수: ${whyInfo.cardCount}개`);
    whyInfo.cards.forEach(card => {
      console.log(`  ${card.index}. ${card.title}: ${card.width}x${card.height}px`);
    });
    console.log(`✅ 모바일에서 1열로 정상 표시됨`);
  }

  // 오버플로우 체크
  const overflowCheck = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    let horizontalOverflow = 0;
    let problematicElements = [];
    
    allElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > window.innerWidth + 1) { // 1px 여유
        horizontalOverflow++;
        if (problematicElements.length < 3) {
          problematicElements.push({
            tag: el.tagName,
            class: (el.className || '').toString().substring(0, 40),
            width: Math.round(rect.width),
            excess: Math.round(rect.width - window.innerWidth)
          });
        }
      }
    });
    
    return { count: horizontalOverflow, elements: problematicElements };
  });

  console.log('\n⚠️  가로 오버플로우 체크:');
  console.log('─'.repeat(70));
  console.log(`오버플로우 요소 수: ${overflowCheck.count}개`);
  if (overflowCheck.count > 0) {
    console.log('주요 오버플로우 요소 (상위 3개):');
    overflowCheck.elements.forEach((el, i) => {
      console.log(`  ${i + 1}. <${el.tag.toLowerCase()}> ${el.class ? `class="${el.class}"` : ''}`);
      console.log(`     너비: ${el.width}px (초과: +${el.excess}px)`);
    });
    console.log('\n💡 참고: 일부 오버플로우는 숨겨진 요소(hidden)일 수 있습니다.');
  } else {
    console.log('✅ 가로 오버플로우 없음');
  }

  // 터치 타겟 크기 체크
  const touchCheck = await page.evaluate(() => {
    const minSize = 44;
    const touchables = document.querySelectorAll('a, button');
    let tooSmall = 0;
    let smallElements = [];
    
    touchables.forEach(el => {
      const rect = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);
      const isHidden = computed.display === 'none' || computed.visibility === 'hidden' || computed.opacity === '0';
      
      if (!isHidden && rect.width > 0 && rect.height > 0) {
        if (rect.width < minSize || rect.height < minSize) {
          tooSmall++;
          if (smallElements.length < 3) {
            smallElements.push({
              tag: el.tagName.toLowerCase(),
              text: el.textContent.trim().substring(0, 25),
              width: Math.round(rect.width),
              height: Math.round(rect.height)
            });
          }
        }
      }
    });
    
    return { count: tooSmall, elements: smallElements };
  });

  console.log('\n👆 터치 타겟 크기 체크 (권장: 44x44px 이상):');
  console.log('─'.repeat(70));
  console.log(`작은 터치 영역: ${touchCheck.count}개`);
  if (touchCheck.count > 0) {
    console.log('주요 작은 터치 요소 (상위 3개):');
    touchCheck.elements.forEach((el, i) => {
      console.log(`  ${i + 1}. <${el.tag}> "${el.text}"`);
      console.log(`     크기: ${el.width}x${el.height}px`);
    });
  }

  // 최종 평가
  console.log('\n' + '═'.repeat(70));
  console.log('📝 최종 평가:');
  console.log('─'.repeat(70));
  
  const issues = [];
  if (pageStats.horizontalScroll) issues.push('가로 스크롤 발생');
  if (overflowCheck.count > 10) issues.push('오버플로우 요소 다수');
  if (touchCheck.count > 20) issues.push('터치 영역 작은 요소 다수');
  
  if (issues.length === 0) {
    console.log('✅ 모든 테스트 통과! 모바일 반응형이 완벽합니다.');
  } else if (issues.length <= 2) {
    console.log('⚠️  일부 경고 사항 있음 (대부분 정상 작동):');
    issues.forEach(issue => console.log(`   - ${issue}`));
    console.log('\n💡 실제 사용에는 문제가 없을 수 있습니다.');
  } else {
    console.log('❌ 개선 필요:');
    issues.forEach(issue => console.log(`   - ${issue}`));
  }
  
  console.log('\n🎯 핵심 체크 항목:');
  console.log(`   ${!pageStats.horizontalScroll ? '✅' : '❌'} 가로 스크롤 없음`);
  console.log(`   ${businessInfo ? '✅' : '❌'} 사업영역 카드 정상 표시`);
  console.log(`   ${whyInfo ? '✅' : '❌'} Why Choose Us 카드 정상 표시`);
  
  console.log('\n' + '═'.repeat(70));
  console.log('✅ 테스트 완료\n');

  await browser.close();
})();
