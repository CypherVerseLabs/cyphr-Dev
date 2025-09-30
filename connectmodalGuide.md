Here’s a full list of all the props in your ConnectModal component based on your provided code:

export interface WalletModalProps {
  rpcUrl?: string                         // RPC endpoint URL for blockchain connection
  chainId?: number                        // Blockchain chain ID
  onlyWallets?: boolean                   // Show only wallets, hide other auth methods
  onLogin?: (token: string) => void      // Callback when user logs in with a token
  onLogout?: () => void                   // Callback when user logs out
  themeOverride?: 'light' | 'dark'       // Force theme color mode
  buttonText?: string                     // Text on the connect wallet button
  navLinks?: { label: string; href: string; icon?: IconType }[]  // Navigation links in modal
  logo?: string | React.ReactNode         // Logo shown in header
  modalSize?: ModalProps['size']          // Size of the modal, e.g. 'xl', '2xl'
  modalProps?: Partial<Omit<ModalProps, 'isOpen' | 'onClose'>> // Additional Chakra modal props
  themeColor?: string                     // Main theme color (e.g. 'gold.500')
  forceOpen?: boolean                     // Control modal open state externally
  onForceClose?: () => void               // Callback when modal is forcibly closed
  hideButton?: boolean                    // Hide the connect wallet button entirely
  logoutRedirectPath?: string             // Path to redirect to after logout
  containerHeight?: string | number      // Height of modal container

  buttonTextColor?: string                // Color of button text
  highlightColor?: string                 // Highlight color (default gold)
  modalBg?: string                       // Modal background color
  modalTextColor?: string                // Text color inside modal
  leftPaneBg?: string                    // Background color of left pane
  rightPaneBg?: string                   // Background color of right pane
  leftPaneWidth?: string                 // Width of the left pane
  rightPaneWidth?: string                // Width of the right pane
  panePadding?: string | number          // Padding inside the panes
  headerContent?: React.ReactNode        // Custom content to replace header section
  footerContent?: React.ReactNode        // Custom content to replace footer section
  leftContent?: React.ReactNode          // Custom content for left pane (overrides default)
  rightContent?: React.ReactNode         // Custom content for right pane (overrides default)
}

Summary:
Prop Name	Type	Description
rpcUrl	string	Blockchain RPC URL
chainId	number	Chain ID
onlyWallets	boolean	Show only wallet options
onLogin	(token: string) => void	Callback on login
onLogout	() => void	Callback on logout
themeOverride	`'light'	'dark'`
buttonText	string	Button text
navLinks	{ label: string; href: string; icon?: IconType }[]	Navigation links in modal
logo	`string	React.ReactNode`
modalSize	ModalProps['size']	Size of the modal
modalProps	`Partial<Omit<ModalProps, 'isOpen'	'onClose'>>`
themeColor	string	Theme color
forceOpen	boolean	Control modal open externally
onForceClose	() => void	Called when modal forcibly closed
hideButton	boolean	Hide the wallet connect button
logoutRedirectPath	string	Path to redirect after logout
containerHeight	`string	number`
buttonTextColor	string	Button text color
highlightColor	string	Highlight color (defaults to gold)
modalBg	string	Modal background color
modalTextColor	string	Modal text color
leftPaneBg	string	Left pane background
rightPaneBg	string	Right pane background
leftPaneWidth	string	Width of left pane
rightPaneWidth	string	Width of right pane
panePadding	`string	number`
headerContent	React.ReactNode	Custom header content
footerContent	React.ReactNode	Custom footer content
leftContent	React.ReactNode	Custom content for left pane
rightContent	React.ReactNode	Custom content for right pane

If you want, I can also help you generate JSDoc comments for these or give usage examples for any of them!

You said:
so what do ththese props do?
ChatGPT said:

Sure! Here’s a breakdown of what each prop does in your ConnectModal component — essentially explaining their purpose and effect on the modal’s behavior or appearance:

Props Explained
Prop Name	What it Does / Purpose
rpcUrl	Sets the blockchain RPC URL the wallet will connect to. Defaults to local RPC.
chainId	Specifies which blockchain network chain ID to connect to (e.g., Ethereum Mainnet, testnets, etc.).
onlyWallets	When true, the modal only shows wallet connection options, hiding other auth or social login methods.
onLogin	Callback function triggered after a successful login with a token (e.g., JWT).
onLogout	Callback called after a user logs out (disconnects wallet, clears session).
themeOverride	Forces the modal’s theme mode to 'light' or 'dark', overriding system or Chakra UI color mode.
buttonText	Text displayed on the main “Connect Wallet” button before connecting.
navLinks	Array of objects defining navigation links (label, URL, and optional icon) shown inside the modal sidebar.
logo	Custom logo to display in the modal header — can be an image URL or a React node/component.
modalSize	Controls the modal’s size ('sm', 'md', 'lg', 'xl', '2xl', etc.), influencing width & height.
modalProps	Additional Chakra UI modal props to customize the modal (except isOpen and onClose).
themeColor	Main theme color used for buttons and highlights (default is 'gold.500').
forceOpen	If set, controls the modal’s open state externally (makes modal controlled).
onForceClose	Callback when the modal is closed by an external control or forcibly closed (used with forceOpen).
hideButton	When true, hides the “Connect Wallet” button entirely, useful when modal is opened programmatically.
logoutRedirectPath	URL path where the user is redirected after logging out (e.g., /login).
containerHeight	Sets the height of the modal’s main content area — controls vertical space inside the modal.
buttonTextColor	Color of the text on the connect button (overrides default styling).
highlightColor	Accent/highlight color used inside modal for text and other UI elements (defaults to gold #FFD700).
modalBg	Background color of the entire modal content area (overrides theme defaults).
modalTextColor	Text color used throughout the modal content (overrides theme defaults).
leftPaneBg	Background color specifically for the left pane of the modal (e.g., wallet list or nav area).
rightPaneBg	Background color for the right pane of the modal (default dark or light depending on theme).
leftPaneWidth	Width of the left pane inside the modal (e.g., '300px').
rightPaneWidth	Width of the right pane inside the modal (e.g., '400px').
panePadding	Padding inside the left and right panes (spacing between content and edges).
headerContent	Custom React node or component to replace or inject additional content in the modal header.
footerContent	Custom React node or component to replace or inject additional content in the modal footer.
leftContent	Custom React node/component to override the entire left pane content (instead of default wallet/nav).
rightContent	Custom React node/component to override the entire right pane content (instead of default).
In short:

Some props control UI appearance and theming (themeColor, modalBg, highlightColor, leftPaneBg, rightPaneBg, buttonTextColor, etc.).

Others manage behavior (e.g., onLogin, onLogout, forceOpen, onForceClose, hideButton).

Some allow content customization (headerContent, footerContent, leftContent, rightContent).

A few handle wallet and blockchain-specific configs (rpcUrl, chainId, onlyWallets, navLinks).

logoutRedirectPath defines where users land after logout.