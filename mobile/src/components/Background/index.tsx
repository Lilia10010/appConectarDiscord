import { ImageBackground } from "react-native";

import backgroundImg from "../../assets/background-galaxy.png";

import { styles } from "./styles";

interface Props {
  children: React.ReactNode;
}
//defaultSource: memoriza e carrega mto mais rápido na aplicação

export function Background({ children }: Props) {
  return (
    <ImageBackground
      source={backgroundImg}
      defaultSource={backgroundImg}
      style={styles.container}
    >
      {children}
    </ImageBackground>
  );
}
