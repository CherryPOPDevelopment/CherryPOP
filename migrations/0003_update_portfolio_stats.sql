UPDATE site_content
SET content = json_set(content, '$.stat1_num', '10+', '$.stat3_num', '2yr')
WHERE section = 'hero'
  AND json_extract(content, '$.stat1_num') = '40+'
  AND json_extract(content, '$.stat3_num') = '5yr';

UPDATE site_content
SET content = json_set(
  content,
  '$.body1',
  'I''m a full-stack freelance developer with 2 years of experience building websites, mobile apps, and online shops. I specialise in no-code development and design with a special interest in python, java, mysql, and css code. I am very passionate and excited to continue to learn and grow my skills and knowledge-- and to work with you!'
)
WHERE section = 'about'
  AND json_extract(content, '$.body1') LIKE '%nearly 2 years of experienceon%';
