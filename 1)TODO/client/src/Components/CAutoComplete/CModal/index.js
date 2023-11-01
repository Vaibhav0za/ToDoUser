import { Modal, Typography } from "@mui/material";
import styles from "./styles";
import PropType from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import BaseColor from "../../../config/color";

const CModal = (props) => {
  const { visible, onClose = () => {}, children, style, title } = props;
  const classes = styles();
  return (
    <Modal open={visible} onClose={onClose} className={classes.modal}>
      <div container style={style} className={`${classes.modalContainer} ${classes.scrollBar}`}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "15px 30px",
            borderBottom: "1px solid #000",
            background: BaseColor.primary,
            position: "sticky",
          }}
        >
          <Typography
            style={{
              fontSize: 20,
              color: "#fff",
            }}
          >
            {title}
          </Typography>
          <CloseIcon
            style={{ color: "#fff", cursor: "pointer" }}
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    </Modal>
  );
};

CModal.propTypes = {
  visible: PropType.bool,
  onClose: PropType.func,
};

CModal.defaultProps = {
  visible: false,
  onClose: () => {},
};
export default CModal;
