const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // iPhone 12 Pro 설정
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  const url = 'https://67402fe0.humanit-webapp.pages.dev';

  console.log('📱 iPhone 12 Pro 상세 테스트\n');
  console.log('═'.repeat(60));

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // 사업영역 섹션으로 스크롤
  await page.evaluate(() => {
    const businessSection = Array.from(document.querySelectorAll('h3')).find(
      el => el.textContent.includes('사업영역')
    );
    if (businessSection) {
      businessSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  await page.waitForTimeout(1000);

  // 사업영역 카드 상세 분석
  const businessCardInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.grid.grid-cols-2 > div'));
    return cards.map((card, index) => {
      const rect = card.getBoundingClientRect();
      const text = card.textContent.trim().split('\n').filter(t => t.trim()).join(' ');
      return {
        index: index + 1,
        text: text.substring(0, 30),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        left: Math.round(rect.left),
        top: Math.round(rect.top),
        visible: rect.top >= 0 && rect.left >= 0 && rect.right <= window.innerWidth
      };
    });
  });

  console.log('\n🎴 사업영역 카드 분석:');
  console.log('─'.repeat(60));
  businessCardInfo.forEach(card => {
    console.log(`카드 ${card.index}: ${card.text}`);
    console.log(`  크기: ${card.width}x${card.height}px`);
    console.log(`  위치: (${card.left}, ${card.top})`);
    console.log(`  화면 내: ${card.visible ? '✓' : '✗'}`);
  });

  // 오버플로우 요소 상세 분석
  const overflowDetails = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    const issues = [];
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > window.innerWidth && rect.width > 0) {
        const tagName = el.tagName.toLowerCase();
        const classes = el.className || '';
        const id = el.id || '';
        issues.push({
          tag: tagName,
          class: classes.toString().substring(0, 50),
          id: id,
          width: Math.round(rect.width),
          overflow: Math.round(rect.width - window.innerWidth)
        });
      }
    });
    return issues.slice(0, 5); // 상위 5개만
  });

  console.log('\n⚠️  가로 오버플로우 요소 (상위 5개):');
  console.log('─'.repeat(60));
  overflowDetails.forEach((issue, i) => {
    console.log(`${i + 1}. <${issue.tag}> ${issue.class ? `class="${issue.class}"` : ''}`);
    console.log(`   너비: ${issue.width}px (초과: ${issue.overflow}px)`);
  });

  // 터치 영역 작은 요소 분석
  const touchIssues = await page.evaluate(() => {
    const touchable = Array.from(document.querySelectorAll('a, button'));
    const issues = [];
    touchable.forEach(el => {
      const rect = el.getBoundingClientRect();
      if ((rect.width < 44 || rect.height < 44) && rect.width > 0) {
        issues.push({
          tag: el.tagName.toLowerCase(),
          text: el.textContent.trim().substring(0, 30),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
      }
    });
    return issues.slice(0, 5);
  });

  console.log('\n👆 터치 영역이 작은 요소 (상위 5개):');
  console.log('─'.repeat(60));
  touchIssues.forEach((issue, i) => {
    console.log(`${i + 1}. <${issue.tag}> "${issue.text}"`);
    console.log(`   크기: ${issue.width}x${issue.height}px (권장: 44x44px 이상)`);
  });

  // Why Choose Us 섹션 분석
  await page.evaluate(() => {
    const whySection = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('선택해야 하는 이유')
    );
    if (whySection) {
      whySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  await page.waitForTimeout(1000);

  const whyChooseUsInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.grid.grid-cols-1 > div')).slice(0, 4);
    return cards.map((card, index) => {
      const rect = card.getBoundingClientRect();
      const title = card.querySelector('h3')?.textContent.trim() || 'No title';
      return {
        index: index + 1,
        title: title,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        visible: rect.top >= 0 && rect.top <= window.innerHeight
      };
    });
  });

  console.log('\n🌟 Why Choose Us 카드 분석:');
  console.log('─'.repeat(60));
  whyChooseUsInfo.forEach(card => {
    console.log(`카드 ${card.index}: ${card.title}`);
    console.log(`  크기: ${card.width}x${card.height}px`);
    console.log(`  화면 내: ${card.visible ? '✓ 보임' : '✗ 스크롤 필요'}`);
  });

  // 전체 페이지 상태
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
  console.log('─'.repeat(60));
  console.log(`뷰포트: ${pageStats.viewportWidth}x${pageStats.viewportHeight}px`);
  console.log(`페이지 전체: ${pageStats.bodyWidth}x${pageStats.bodyHeight}px`);
  console.log(`가로 스크롤: ${pageStats.horizontalScroll ? '❌ 발생함' : '✅ 없음'}`);

  console.log('\n' + '═'.repeat(60));
  console.log('✅ 상세 테스트 완료');
  console.log('═'.repeat(60));

  await browser.close();
})();
