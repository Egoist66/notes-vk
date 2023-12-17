import styled from "styled-components";


type StyledButtonProps = {
    _background?: string
    _width?: string,
}

type ButtonPropsType = {
    text: string
    onClickHandler: () => void
    _background?: string,
    title?: string
    _id?: string,
    _width?: string,
    _disabled?: boolean
}
const StyledButton = styled.button.attrs({
    className: 'waves-effect waves-light btn'
})<StyledButtonProps>`
  
  background-color: ${props => props._background} !important;
  width: ${props => props._width ?? '200px'};
 
`



export function Button({text, title, _width, onClickHandler, _disabled, _background, _id}: ButtonPropsType){
    return (

        <StyledButton
            title={title}
             id={_id}
            _width={_width}
            _background={_background}
            disabled={_disabled}
            onClick={onClickHandler}>{text}
        </StyledButton>
    )

}