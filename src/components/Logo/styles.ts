import styled from "@emotion/styled";

import { Link } from "../Link";

export const LogoLink = styled(Link)(() => {
  return {
    textDecoration: "none",
    color: "black",
    fontSize: "1.5rem",
    fontWeight: 600,
    display: "flex",
    "&:hover": {
      textDecoration: "none",
    },
  };
});
