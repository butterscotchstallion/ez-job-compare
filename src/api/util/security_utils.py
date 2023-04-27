
class SecurityUtils:

	def get_access_denied_response(self):
	    return {
	        'status': 'ERROR',
	        'message': 'Access denied'
	    }