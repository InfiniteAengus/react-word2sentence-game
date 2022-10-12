import { HEADER_TEXT, HEAER_LINK } from 'src/config/global';

const Header = () => {
  return (
    <header>
      <span></span>
      <span style={{ marginLeft: 'auto' }}>
        <a href={HEAER_LINK}>{HEADER_TEXT}</a>
      </span>
    </header>
  );
};

export default Header;
