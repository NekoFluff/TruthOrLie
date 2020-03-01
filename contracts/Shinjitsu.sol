pragma solidity ^0.5.10;
import "./SafeMath.sol";


contract ERC20Interface {
    function totalSupply() public view returns (uint256);
    function balanceOf(address tokenOwner) public view returns (uint256 balance);
	  function allowance(address tokenOwner, address spender) public view returns (uint256 remaining);
    function transfer(address to, uint tokens) public returns (bool success);
	  function approve(address spender, uint tokens) 	public returns (bool success);
    function transferFrom (address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event MinterAdded(address indexed account);
    event MinterRemoved(address indexed account);
}

contract Shinjitsu is ERC20Interface {
    using SafeMath for uint256;
    string public name;
    string public symbol;
    uint8 public decimals;
    
    uint256 public _totalSupply;
    
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint)) allowed;
    mapping(address => bool) isMinter;
    address owner;

    modifier onlyMinter() {
        require(isMinter[msg.sender] || msg.sender == owner);
        _;
    }
    
    constructor() public {
        name = "Shinjitsu";
        symbol = "SHN";
        decimals = 18;
        
        owner = msg.sender;
        isMinter[msg.sender] = true;
        _totalSupply = 100000000000000000000000000; //100000000
        balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }
    
     /**
      * @dev Total number of tokens in existence
     */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    
    /**
    * @dev Gets the balance of the specified address.
    * @param tokenOwner The address to query the balance of.
    * @return An uint256 representing the amount owned by the passed address.
    */
    function balanceOf(address tokenOwner) public view returns (uint256 balance) {
        return balances[tokenOwner];
    }
    
    /**
    * @dev Function to check the amount of tokens that an owner allowed to a spender.
    * @param tokenOwner address The address which owns the funds.
    * @param spender address The address which will spend the funds.
    * @return A uint256 specifying the amount of tokens still available for the spender.
    */
    function allowance(address tokenOwner, address spender) public view returns (uint256 remaining) {
        return allowed[tokenOwner][spender];
    }
    
    /**
    * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
    * Beware that changing an allowance with this method brings the risk that someone may use both the old
    * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
    * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
    * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    * @param spender The address which will spend the funds.
    * @param tokens The amount of tokens to be spent.
    */
    function approve(address spender, uint tokens) public returns (bool success) {
        require(spender != address(0));
        
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
    
    /**
    * @dev Transfer token for a specified address
    * @param to The address to transfer to.
    * @param tokens The amount to be transferred.
    */
    function transfer(address to, uint tokens) public returns (bool success) {
        require(tokens <= balances[msg.sender]);
        require(to != address(0));
    
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
    
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
    
    /**
    * @dev Transfer tokens from one address to another
    * @param from address The address which you want to send tokens from
    * @param to address The address which you want to transfer to
    * @param tokens uint256 the amount of tokens to be transferred
    */
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        require(tokens <= balances[from], "Not enough tokens to transfer");
        require(tokens <= allowed[from][msg.sender]);
        require(to != address(0));
        
        
        balances[from] = balances[from].sub(tokens);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
            
    	emit Transfer(from, to, tokens);
        return true;
    }
    
    /**
   * @dev Increase the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed_[_spender] == 0. To increment
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param spender The address which will spend the funds.
   * @param addedValue The amount of tokens to increase the allowance by.
   */
  function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
    require(spender != address(0));

    allowed[msg.sender][spender] = (allowed[msg.sender][spender].add(addedValue));
    emit Approval(msg.sender, spender, allowed[msg.sender][spender]);
    return true;
  }

  /**
   * @dev Decrease the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed_[_spender] == 0. To decrement
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param spender The address which will spend the funds.
   * @param subtractedValue The amount of tokens to decrease the allowance by.
   */
  function decreaseAllowance(address spender, uint256 subtractedValue)
    public
    returns (bool)
  {
    require(spender != address(0));

    allowed[msg.sender][spender] = (allowed[msg.sender][spender].sub(subtractedValue));
    emit Approval(msg.sender, spender, allowed[msg.sender][spender]);
    return true;
  }
  
  function addMinter(address account) public onlyMinter {
      isMinter[account] = true;
      emit MinterAdded(account);
  }
  
  function renounceMinter(address account) public {
      require(account == msg.sender, 'Can only renounce yourself.');
      isMinter[account] = false;
      emit MinterRemoved(account);
  }

  /**
   * @dev Internal function that mints an amount of the token and assigns it to
   * an account. This encapsulates the modification of balances such that the
   * proper events are emitted.
   * @param account The account that will receive the created tokens.
   * @param amount The amount that will be created.
   */
  function _mint(address account, uint256 amount) public onlyMinter returns (bool) {
    require(account != address(0));
    _totalSupply = _totalSupply.add(amount);
    balances[account] = balances[account].add(amount);
    emit Transfer(address(0), account, amount);
    return true;
  }

  /**
   * @dev Internal function that burns an amount of the token of a given
   * account.
   * @param account The account whose tokens will be burnt.
   * @param amount The amount that will be burnt.
   */
  function _burn(address account, uint256 amount) public onlyMinter returns (bool) {
    require(account != address(0));
    require(amount <= balances[account]);

    _totalSupply = _totalSupply.sub(amount);
    balances[account] = balances[account].sub(amount);
    emit Transfer(account, address(0), amount);
    return true;
  }

  /**
   * @dev Internal function that burns an amount of the token of a given
   * account, deducting from the sender's allowance for said account. Uses the
   * internal burn function.
   * @param account The account whose tokens will be burnt.
   * @param amount The amount that will be burnt.
   */
  function _burnFrom(address account, uint256 amount) public onlyMinter returns (bool) {
    require(amount <= allowed[account][msg.sender]);

    // Should https://github.com/OpenZeppelin/zeppelin-solidity/issues/707 be accepted,
    // this function needs to emit an event with the updated approval.
    allowed[account][msg.sender] = allowed[account][msg.sender].sub(
      amount);
    _burn(account, amount);
    return true;
  }
}