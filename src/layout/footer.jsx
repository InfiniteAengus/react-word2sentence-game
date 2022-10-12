import { APP_NAME, COPYRIGHT } from 'src/config/global';

const Footer = () => {
  return (
    <footer>
      <span>
        {COPYRIGHT} - {APP_NAME}
      </span>
    </footer>
  );
};

export default Footer;
