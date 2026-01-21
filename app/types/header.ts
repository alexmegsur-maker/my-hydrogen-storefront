import type { HydrogenComponentProps, WeaverseImage } from "@weaverse/hydrogen";

export interface BaseItem {
    id:string;
    type:string;
    position:string;
}

export interface HeaderTextProps extends BaseItem {
    type:'textLeft';
    position:'right';
    heading:string;
    containerSize:number;
    title?:string;
    paragraph?:string;
    decoration?:string;
    overContainer:boolean;
    customClass?:string;
    tLetterSpacing?:string;
    tSize:string;
    tColor:string;
    tBgColor:string;
    tAlignment:"left"|"center"|"right"|"justify";
    tPaddingSelect:string;
    tPaddingText?:string;
    tMarginSelect:string;
    tMarginText?:string;
    tWeight:string;
    tFontFamily:string;
    pConSize:number;
    pLetterSpacing:string;
    pSize:string;
    pColor:string;
    pBgColor:string;
    pAlignment:"left"|"center"|"right"|"justify";
    pPaddingSelect:string;
    pPaddingText:string;
    pMarginSelect:string;
    pMarginText:string;
    pWeight:string;
    pFontFamily:string;
    mbContainerSize:number;
    mbTLetterSpacing:string;
    mbTSize:string;
    mbTColor:string;
    mbTBgColor:string;
    mbTAlignment:"left"|"center"|"right"|"justify";
    mbTPaddingSelect:string;
    mbTPaddingText?:string;
    mbTMarginSelect:string;
    mbTMarginText?:string;
    mbTWeight:string;
    mbPConSize:number;
    mbPLetterSpacing:string;
    mbPSize:string;
    mbPColor:string;
    mbPBgColor:string;
    mbPAlignment:"left"|"center"|"right"|"justify";
    mbPPaddingSelect:string;
    mbPPaddingText?:string;
    mbPMarginSelect:string;
    mbPMarginText?:string;
    mbPWeight:string;
}
export interface HeaderBannerProps extends BaseItem{
    type:"banner";
    position:'right';
    heading:string;
    image:WeaverseImage;
    imageWidth:number;
    imgColor:string;
    borderSize:number;
    header:string;
    title:string;
    description:string;
    linkText:string;
    link:string;
    fontFamily:string;
    paddingSelect:string;
    padding?:string; 
    customClass?:string;
    // header
    headerSpacing:string;
    headerSize:string;
    headerColor:string;
    headerBgColor:string;
    headerAlignment:"left"|"center"|"right"|"justify";
    headerPaddingSelect:string;
    headerPadding?:string;
    headerMarginSelect:string;
    headerMargin?:string;
    headerWeight:string;
    // title
    tSpacing:string;
    tSize:string;
    tColor:string;
    tBgColor:string;
    tAlignment:"left"|"center"|"right"|"justify";
    tPaddingSelect:string;
    tPadding?:string;
    tMarginSelect:string;
    tMargin?:string;
    tWeight:string;
    // Description
    dSpacing:string;
    dSize:string;
    dColor:string;
    dBgColor:string;
    dAlignment:"left"|"center"|"right"|"justify";
    dPaddingSelect:string;
    dPadding?:string;
    dMarginSelect:string;
    dMargin?:string;
    dWeight:string;
    // button
    buttonHtml?:string;
    bSpacing:string;
    bSize:string;
    bColor:string;
    bBgColor:string;
    bAlignment:"left"|"center"|"right"|"justify";
    bPaddingSelect:string;
    bPadding?:string;
    bMarginSelect:string;
    bMargin?:string;
    bWeight:string;
    // Mobile settings
    mbImgColor:string;
    mbBorderSize:number;
    mbPaddingSelect:string;
    mbPadding?:string; 
    //  header mobile
    mbHeaderSpacing:string;
    mbHeaderSize:string;
    mbHeaderColor:string;
    mbHeaderBgColor:string;
    mbHeaderAlignment:"left"|"center"|"right"|"justify";
    mbHeaderPaddingSelect:string;
    mbHeaderPadding?:string;
    mbHeaderMarginSelect:string;
    mbHeaderMargin?:string;
    mbHeaderWeight:string;      
    // title mobile
    mbTSpacing:string;
    mbTSize:string;
    mbTColor:string;
    mbTBgColor:string;
    mbTAlignment:"left"|"center"|"right"|"justify";
    mbTPaddingSelect:string;
    mbTPadding?:string;
    mbTMarginSelect:string;
    mbTMargin?:string;
    mbTWeight:string; 
    // Description mobile
    mbDSpacing:string;
    mbDSize:string;
    mbDColor:string;
    mbDBgColor:string;
    mbDAlignment:"left"|"center"|"right"|"justify";
    mbDPaddingSelect:string;
    mbDPadding?:string;
    mbDMarginSelect:string;
    mbDMargin?:string;
    mbDWeight:string; 
    // button
    mbBSpacing:string;
    mbBSize:string;
    mbBColor:string;
    mbBBgColor:string;
    mbBAlignment:"left"|"center"|"right"|"justify";
    mbBPaddingSelect:string;
    mbBPadding?:string;
    mbBMarginSelect:string;
    mbBMargin?:string;
    mbBWeight:string;
}

export interface HeaderImageLinkProps extends BaseItem{
    type:'imageLink';
    position:'right';
    heading:string;
    changeDirection:boolean;
    // first Image
    img:WeaverseImage;
    mbImg:WeaverseImage;
    link:string;
    html1:string;
    // second Image
    img2:WeaverseImage;
    mbImg2:WeaverseImage;
    link2:string;
    html2:string;
    // third Image
    img3:WeaverseImage;
    mbImg3:WeaverseImage;
    link3:string;
    html3:string;
    space:string;
    color:string;
    anchor:string;
    size:number;
    paddingSelect:string;
    padding?:string;
    marginSelect:string;
    margin?:string;
    customClass:string;
}
export interface HeaderGeneralEditProps extends BaseItem{
    type:'general';
    position:'general';
    heading:string;
    bgColor:string;
    bgLeftColor:string;
    bgRightColor:string;
    size:number;
    height?:string;
    showDivisor:string;
    colorDivisor:string;
    divisorWidth:number;
    divisorHeight:string;
    mSize:number;
    paddingSelect:string; 
    padding?:string;
    tColor:string;
    tHColor:string;
    tSpacing:string;
    tPaddingSelect:string;
    tPadding?:string;
    tMarginSelect:string;
    tMargin?:string;
    tWeight:string;
    sColor:string;
    sHColor:string;
    sSpacing:string;
    sPaddingSelect:string;
    sPadding?:string;
    sMarginSelect:string;
    sMargin?:string;
    sWeight:string;
    mbBgColor:string;
    mbBgRightColor:string;
    mbSize:number;
    mbHeight?:string;
    mbMSize:number;
    mbPaddingSelect:string;
    mbPadding?:string;
    mbTColor:string;
    mbTHColor:string;
    mbTSpacing:string;
    mbTPaddingSelect:string;
    mbTPadding?:string;
    mbTMarginSelect:string;
    mbTMargin?:string;
    mbTWeight:string;
    mbSColor:string;
    mbSHColor:string;
    mbSpacing:string;
    mbSPaddingSelect:string;
    mbSPadding?:string;
    mbSMarginSelect:string;
    mbSMargin?:string;
    mbSWeight:string;
}

export interface HeaderTopTextProps extends BaseItem{
    type:'textTop';
    position:'top';
    heading:string;
    containerSize:number;
    title:string;
    paragraph:string;
    decoration?:string;
    overContainer:boolean;
    //  "Title"
    tSpacing:string;
    tSize:string;
    tColor:string;
    tBgColor:string;
    tAlignment:"left"|"center"|"right"|"justify";
    tPaddingSelect:string;
    tPadding?:string;
    tMarginSelect:string;
    tMargin?:string;
    tWeight:string;
    tFontFamily:string;
    //  "Paragraph"
    containerPSize:number;
    pSpacing:string;
    pSize:string;
    pColor:string;
    pBgColor:string;
    pAlignment:"left"|"center"|"right"|"justify";
    pPaddingSelect:string;
    pPadding?:string;
    pMarginSelect:string;
    pMargin?:string;
    pWeight:string;
    pFontFamily:string;
    //  "mobile settings"
    mbContainerSize:number; 
    // "Title"
    mbTSpacing:string;
    mbTSize:string;
    mbTColor:string;
    mbTBgColor:string;
    mbTAlignment:"left"|"center"|"right"|"justify";
    mbTPaddingSelect:string;
    mbTPadding?:string;
    mbTMarginSelect:string;
    mbTMargin?:string;
    mbTWeight:string;
    //  "Paragraph"
    mbContainerPSize:number;
    mbPSpacing:string;        
    mbPSize:string;
    mbPColor:string;
    mbPBgColor:string;
    mbPAlignment:"left"|"center"|"right"|"justify";
    mbPPaddingSelect:string;
    mbPPadding?:string;
    mbPMarginSelect:string;
    mbPMargin?:string;
    mbPWeight:string;
    customClass:string;
}
export interface HeaderTopProductProps extends BaseItem{
    type:"productTop"
    position:'top';
    heading:string;
    img1?:WeaverseImage;
    img1Link:string;
    img2?:WeaverseImage;
    img2Link:string;
    img3?:WeaverseImage;
    img3Link:string;
    imgListSize:number;
    selectMobile:string;
    mbImgListSize:number;
    logo?:WeaverseImage;
    generalLink:string;
    title:string;
    header:string;
    description:string;
    logoSize:number;
    // "container"
    gPaddingSelect:string;
    gPadding?:string;
    gMarginSelect:string;
    gMargin?:string;
    // "general"
    bSize:number;
    bColor:string;
    paddingSelect:string;
    padding?:string;
    marginSelect:string;
    margin?:string;
    //  "title/logo"
    tSpacing:string;
    tAlignment:"left"|"center"|"right"|"justify";
    tColor:string;
    tSize:string;
    tPaddingSelect:string;
    tPadding?:string;
    tMarginSelect:string;
    tMargin?:string;
    tWeight:string;
    //  "heading"
    hSpacing:string;
    hAlignment:"left"|"center"|"right"|"justify";
    hColor:string;
    hSize:string;
    hPaddingSelect:string;
    hPadding?:string;
    hMarginSelect:string;
    hMargin?:string;
    hWeight:string;
    //  "description"
    dSpacing:string;
    dAlignment:"left"|"center"|"right"|"justify";
    dColor:string;
    dSize:string;
    dPaddingSelect:string;
    dPadding?:string;
    dMarginSelect:string;
    dMargin?:string;
    dWeight:string;
    //  "Mobile settings"
    mbLogoSize:number;
    // "container"
    mbGPaddingSelect:string;
    mbGPadding?:string;
    mbGMarginSelect:string;
    mbGMargin?:string;
    // "general"
    mbBSize:number;
    mbBColor:string;
    mbPaddingSelect:string;
    mbPadding?:string;
    mbMarginSelect:string;
    mbMargin?:string;
    //  "title/logo"
    mbTSpacing:string;
    mbTAlignment:"left"|"center"|"right"|"justify";
    mbTColor:string;
    mbTSize:string;
    mbTPaddingSelect:string;
    mbTPadding?:string;
    mbTMarginSelect:string;
    mbTMargin?:string;
    mbTWeight:string;
    //  "heading"
    mbHSpacing:string;
    mbHAlignment:"left"|"center"|"right"|"justify";
    mbHColor:string;
    mbHSize:string;
    mbHPaddingSelect:string;
    mbHPadding?:string;
    mbHMarginSelect:string;
    mbHMargin?:string;
    mbHWeight:string;
    //  "description"
    mbDSpacing:string;
    mbDAlignment:"left"|"center"|"right"|"justify";
    mbDColor:string;
    mbDSize:string;
    mbDPaddingSelect:string;
    mbDPadding?:string;
    mbDMarginSelect:string;
    mbDMargin?:string;
    mbDWeight:string;
}

export type DynamicContentConfig = HeaderTextProps | HeaderBannerProps | HeaderImageLinkProps | HeaderGeneralEditProps | HeaderTopTextProps | HeaderTopProductProps

export interface ComponentStore{
    headerMenuItems:DynamicContentConfig[];
    addComponent:(item:DynamicContentConfig)=>void;
    removeComponent:(id:string)=>void;
    setComponents:(newComponents:DynamicContentConfig[])=>void;
}