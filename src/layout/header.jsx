import { HEAER_LINK } from 'src/config/global';

const Header = () => {
  return (
    <header>
      <span></span>
      <span style={{ marginLeft: 'auto' }}>
        <a href={HEAER_LINK}>test-link-to-other-page</a>
      </span>
    </header>
  );
};

export default Header;
