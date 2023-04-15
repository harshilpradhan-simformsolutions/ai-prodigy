import {
  createStyles,
  Header as MantineHeader,
  Group,
  Burger,
  Container,
  rem,
  Flex,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavLink, Outlet } from 'react-router-dom';
import logo from '../assets/react-query.png';

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: '#333',
    borderBottom: 0,
  },

  inner: {
    height: rem(56),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
          .background!,
        0.1
      ),
    },

    '&.active': {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
          .background!,
        0.1
      ),
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },
}));

interface HeaderSearchProps {
  links: {
    link: string;
    label: string;
  }[];
}

export function HeaderMenuColored({ links }: HeaderSearchProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();

  const items = links.map((link) => {
    return (
      <NavLink
        key={link.label}
        to={link.link}
        className={({ isActive }) => {
          return `${classes.link} ${isActive ? 'active' : ''}`.trim();
        }}
      >
        {link.label}
      </NavLink>
    );
  });

  return (
    <MantineHeader height={56} className={classes.header} mb={20}>
      <Container>
        <div className={classes.inner}>
          <Flex justify="center" align="center" gap="sm">
            <img
              style={{ height: '45px', width: '45px', objectFit: 'cover' }}
              src={logo}
            />
            <Title size="23px" color="white">
              React Query
            </Title>
          </Flex>
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
            color="#fff"
          />
        </div>
      </Container>
    </MantineHeader>
  );
}

const Header = () => (
  <>
    <HeaderMenuColored
      links={[
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Users',
          link: '/users',
        },
        {
          label: 'Posts',
          link: '/posts',
        },
        {
          label: 'Active Users',
          link: '/active',
        },
      ]}
    />
    <Container>
      <Outlet />
    </Container>
  </>
);

export { Header };
